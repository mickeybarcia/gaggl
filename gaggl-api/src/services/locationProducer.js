const { Kafka } = require("kafkajs");

const { kafka: kafkaConfig } = require('../config');

const { brokers } = kafkaConfig;
const kafka = new Kafka({ brokers });
const producer = kafka.producer();
const topic = "user_location"

const start = async () => await producer.connect();

const stop = async () => await producer.disconnect();

const sendNewUserUpdate = async (newUserUpdate) => {
    const value = JSON.stringify(newUserUpdate);
    const messages = [{ value }];
    await producer.send({ topic, messages });
}

module.exports = {
    start,
    stop,
    sendNewUserUpdate
};
