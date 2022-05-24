const { Client } = require('elasticsearch');

const { elastic: elasticConfig } = require('../config');

const {
  node,
  maxRetries,
  requestTimeout,
  index,
  docType: type
} = elasticConfig;
const elasticClient = new Client({
  node,
  maxRetries,
  requestTimeout
});

const createGeoIndex = async () => {
  await elasticClient.indices.create({
    index,
    body: {
      settings: {
        number_of_shards: 1,
      },
      mappings: {
        properties: {
          location: {
            type: 'geo_point'
          },
        },
      },
    },
  });
};

const deleteAllDocuments = async () => {
  await elasticClient.deleteByQuery({
    index,
    type,
    body: {
      query: {
        match_all: {}
      }
    }
  });
};

const deleteUserLocation = async ({ userId: id }) => {
  await elasticClient.delete({
    index,
    type,
    id
  });
};

const searchGeoIndex = async ({ location, distance: distanceInKm }) => {
  const res = await elasticClient.search({
    index,
    body: {
      // TODO: paginate
      // from: start
      // size: 10
      // sort
      query: {       
        bool : {
          must : {
            match_all: {}
          },
          filter : {
            geo_distance : {
              distance: String(distanceInKm) + 'km',
              location
            }
          }
        }
      }
    }
  })
  return res.hits.hits;
}

module.exports = {
  createGeoIndex,
  deleteUserLocation,
  searchGeoIndex,
  deleteAllDocuments
};
