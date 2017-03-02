import Ember from 'ember';
import request from 'ic-ajax';
import UsesOseDefaults from '../../mixins/uses-ose-defaults';
import ResetsVerticalScroll from '../../mixins/resets-vertical-scroll';
import Humanize from '../../utils/humanize';

export default Ember.Route.extend(UsesOseDefaults, ResetsVerticalScroll, {

  beforeModel() {
    // Ensure the deployment has been persisted so the server is capable
    // of mounting and reading available disk space on the specified NFS mount
    // If the deployment is not saved, can end up in a race condition and
    // the server load will fail on first route.
    const deployment = this.modelFor('openshift');
    return deployment.save();
  },

  model() {
    const deployment = this.modelFor('openshift');
    return Ember.RSVP.hash({
      deployment,
      maxResources: this.loadMaxResources(deployment)
    });
  },

  setupController(controller, model) {
    const deployment = model.deployment;
    const maxRes = model.maxResources;
    controller.set('model', model.deployment);

    // TODO: Disabling provider selection until OpenStack is supported post-GA
    deployment.set('openshift_install_loc', 'RHEV');

    // Set max resources to smart values
    deployment.set('openshift_available_vcpu', maxRes.get('vcpuAvailable'));
    deployment.set('openshift_available_ram', maxRes.get('ramAvailable'));
    if(maxRes.diskAvailable === 0) {
      controller.set(
        'errorMsg',
        'Failed to mount NFS share, could not load available disk space');
    } else {
      deployment.set('openshift_available_disk', maxRes.get('diskAvailable'));
    }

    var isRhev = this.controllerFor('deployment').get('isRhev');
    var isOpenStack = this.controllerFor('deployment').get('isOpenStack');
    if (isRhev && !(isOpenStack)) {
      deployment.set('openshift_install_loc', 'RHEV');
    } else if (!(isRhev) && isOpenStack) {
      deployment.set('openshift_install_loc', 'OpenStack');
    }

    var result = {
      vcpuAvailable: 8,
      ramAvailable: 32,
      diskAvailable: 250
    };

    if (this.shouldUseOseDefault(deployment.get('openshift_available_vcpu'))) {
      deployment.set('openshift_available_vcpu', result['vcpuAvailable']);
    }
    if (this.shouldUseOseDefault(deployment.get('openshift_available_ram'))) {
      deployment.set('openshift_available_ram', result['ramAvailable']);
    }
    if (this.shouldUseOseDefault(deployment.get('openshift_available_disk'))) {
      deployment.set('openshift_available_disk', result['diskAvailable']);
    }

    let oseDeploymentType = deployment.get('openshift_number_master_nodes') > 1 ? 'highly_available' : 'single_node';
    controller.set('oseDeploymentType', oseDeploymentType);
    let numTotalNodes = deployment.get('openshift_number_master_nodes') + deployment.get('openshift_number_worker_nodes');
    if (oseDeploymentType === 'highly_available') {
      numTotalNodes += 4;
    }
    controller.set('numTotalNodes', numTotalNodes);
  },

  loadMaxResources(deployment) {
    // Calculate aggregate available resources based on hypervisors chosen
    // and disk space available. cpus + ram are available from discovered-hosts,
    // but we need to hit an ad hoc endpoint to retrieve the available disk
    // space from fusor server.
    //
    // load disk space -> load discovered hosts -> aggregate and return
    // composite Ember object.
    //
    // f(diskSpace, hypervisors) = maxResources

    const diskSpaceP = this.loadDiskSpace(deployment);

    return diskSpaceP
      .then(disk => {
        // Load hosts if not already available
        return Ember.RSVP.hash({
          disk: disk,
          hvs: deployment.get('discovered_hosts')
        });
      })
      .then(hash => {
        // Calculate aggregates
        const hvs = hash.hvs;

        const cpus = hvs.reduce((accum, hv) => {
          const cpu = hv.get('cpus') || 0;
          return accum + cpu;
        }, 0);

        const ram = Humanize.rawToHuman(
          hvs.reduce((accum, hv) => {
            const mem = hv.get('memory_human_size') || '0 B';
            return accum + Humanize.humanToRaw(mem);
          }, 0),
          {output: 'object'}
        ).value;

        const humanDisk = Humanize.rawToHuman(hash.disk, {output: 'object'});
        const displayVal = humanDisk.suffix === 'TB' ?
          humanDisk.value * 1024 : humanDisk.value;

        return Ember.Object.create({
          vcpuAvailable: cpus,
          ramAvailable: ram,
          diskAvailable: displayVal
        });
      });
  },

  loadDiskSpace(deployment) {
    const deploymentId = deployment.get('id');
    const token = Ember.$('meta[name="csrf-token"]').attr('content');
    return request({
      url: `${window.fusorServer}/fusor/api/v21/deployments/${deploymentId}/openshift_disk_space`,
      headers: {
        "Accept": "application/json",
        "X-CSRF-Token": token
      }
    })
    .then(res => res.openshift_disk_space * 1024 * 1024) // Server returns MBs
    .catch(err => {
      // jqXHR.responseJSON
      console.log('An error occurred while loading available disk space!');
      console.log(err);
      return 0;
    });
  },

  deactivate() {
    return this.send('saveDeployment', null);
  }

});
