import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

  host: window.fusorServer,
  namespace: '',
  urlForQuery(query, modelName) {
    // Use owner key to get consumers (subscription application manangers)
    // GET /fusor/api/v21/customer_portal/owners/#{OWNER['key']}/consumers?type=satellite
    return window.fusorServer + '/fusor/api/v21/customer_portal/owners/' + query['owner_key'] + '/consumers?type=satellite';
  }

});
