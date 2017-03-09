import Ember from 'ember';
import DiscoveredHostRouteMixin from '../../mixins/discovered-host-route-mixin';
import NeedsDiscoveredHostsAjax from '../../mixins/needs-discovered-hosts-ajax';

export default Ember.Route.extend(DiscoveredHostRouteMixin, NeedsDiscoveredHostsAjax, {
  model() {
    return this.modelFor('deployment').get('discovered_hosts');
  },

  setupController(controller, model) {
    this._super(controller, model);

    let deployment = this.modelFor('deployment');
    this.set('saveOnTransition', deployment.get('isNotStarted'));

    if (deployment.get('isNotStarted') && Ember.isEmpty(deployment.get('rhev_self_hosted_engine_hostname')) && Ember.isPresent(deployment.get('label'))) {
      let dasherizedLabel = deployment.get('label').trim().replace(/_/g, '-');
      deployment.set('rhev_self_hosted_engine_hostname', `${dasherizedLabel}-rhv-engine`);
    }
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
      let hypervisorModelIds = this.controllerFor('hypervisor/discovered-host').get('hypervisorModelIds');
      let hypervisorHosts = this.controllerFor('hypervisor/discovered-host').get('hypervisorHosts');
      this.set('saveOnTransition', false);
      transition.abort();
      this.postDiscoveredHosts(deployment, hypervisorHosts).catch(err => {
        console.log(err);
      }).finally(() => {
        transition.retry();
      });
    }
  }
});
