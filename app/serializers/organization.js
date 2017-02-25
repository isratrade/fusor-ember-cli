import DS from 'ember-data';

export default DS.RESTSerializer.extend({

  normalize(modelClass, hash) {
    if (hash.owner_details && hash.owner_details.upstreamConsumer) {
      hash.upstream_consumer_uuid = hash.owner_details.upstreamConsumer.uuid;
      hash.upstream_consumer_name = hash.owner_details.upstreamConsumer.name;
    }
    return this._super(modelClass, hash);
  }

});
