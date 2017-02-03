import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  host: window.fusorServer,
  namespace: 'fusor/api/v21'
});
