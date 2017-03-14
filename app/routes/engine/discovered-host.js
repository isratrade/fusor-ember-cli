import Ember from 'ember';
import DiscoveredHostRouteMixin from "../../mixins/discovered-host-route-mixin";
import NeedsDiscoveredHostsAjax from '../../mixins/needs-discovered-hosts-ajax';

export default Ember.Route.extend(DiscoveredHostRouteMixin, NeedsDiscoveredHostsAjax, {
  model() {
    return this.modelFor('deployment').get('discovered_host');
  },

  setupController(controller, model) {
    this._super(controller, model);

    let deployment = this.modelFor('deployment');
    this.set('saveOnTransition', deployment.get('isNotStarted'));
  },

  deactivate() {
    this.send('saveDeployment', null);
  },

  actions: {
    willTransition(transition) {
      if (!this.get('saveOnTransition')) {
        return true;
      }

      let deployment = this.modelFor('deployment');
      let selectedRhevEngineHost = this.controllerFor('engine/discovered-host').get('selectedRhevEngineHost');
      this.set('saveOnTransition', false);
      transition.abort();
      this.postDiscoveredEngineHost(deployment, selectedRhevEngineHost).catch(err => {
        console.log(err);
      }).finally(() => {
        transition.retry();
      });
    }
  }

});
