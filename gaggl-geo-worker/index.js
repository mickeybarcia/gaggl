const { Kafka, logLevel } = require('kafkajs');
const { Client } = require('elasticsearch');

const {
  kafka: {
    brokers,
    topic,
    groupId
  },
  elastic: {
    index,
    type,
    clientConfig
  }
} = require('./config');

const kafka = new Kafka({ brokers, logLevel: logLevel.INFO });
const consumer = kafka.consumer({ groupId });

const elasticClient = new Client(clientConfig);

const saveUserLocation = async ({ userId: id, location }) => {
    await elasticClient.update({
      type,
      id,
      index,
      body: {
        doc: {
          location
        },
        doc_as_upsert: true
      }
    });
  }

const processConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic });
    await consumer.run({
        eachMessage: async ({ message }) => {
            const { location, userId } = JSON.parse(message.value);
            await saveUserLocation({ location, userId });
            console.log('location saved');
        },
    });
}

processConsumer();