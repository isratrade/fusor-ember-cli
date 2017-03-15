import Ember from 'ember';
import request from 'ic-ajax';

export default Ember.Mixin.create({
  postDiscoveredHosts(deployment, hypervisorHosts) {
    const token = Ember.$('meta[name="csrf-token"]').attr('content');
    let hypervisorIds = hypervisorHosts.sortBy('id').getEach('id');
    let hypervisorNames = hypervisorHosts.sortBy('id').getEach('name');
    let arrayIdsNames = hypervisorIds.concat(hypervisorNames);

    return request({
      url: window.fusorServer + '/fusor/api/v21/deployments/' + deployment.get('id'),
      type: 'PUT',
      data: JSON.stringify({'deployment': { 'discovered_host_ids_names': arrayIdsNames } }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': token
      }
    }).then(() => deployment.reload()); // Reload to update models
  },

  postDiscoveredEngineHost(deployment, selectedRhevEngineHost) {
    const token = Ember.$('meta[name="csrf-token"]').attr('content');
    let engineId = selectedRhevEngineHost.get('id');
    let engineName = selectedRhevEngineHost.get('name');

    return request({
      url: window.fusorServer + '/fusor/api/v21/deployments/' + deployment.get('id') + '/add_rhv_engine',
      type: 'PUT',
      data: JSON.stringify({'engine_id': engineId,
                            'engine_name': engineName }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': token
      }
    }).then(() => deployment.reload()); // Reload to update models
  }

});
