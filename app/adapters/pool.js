import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

  host: window.fusorServer,
  namespace: '',
  urlForQuery(query, modelName) {
    // Use consumer UUID to get pools
    // GET /fusor/api/v21/customer_portal/pools?consumer=' + consumerUUID + '&listall=false');
    return window.fusorServer + "/fusor/api/v21/customer_portal/pools?consumer=" + query["uuid"] + "&listall=false";
  }

});
