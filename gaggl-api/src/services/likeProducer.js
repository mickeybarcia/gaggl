const { Kafka } = require("kafkajs");

const { kafka: kafkaConfig } = require('../config');

const { brokers } = kafkaConfig;
const kafka = new Kafka({ brokers });
const producer = kafka.producer();
const topic = "user_likes";

const start = async () => await producer.connect();

const stop = async () => await producer.disconnect();

const sendUserLikeUpdate = async (newLikeUpdate) => {
    const value = JSON.stringify(newLikeUpdate);
    const messages = [{ value }];
    await producer.send({ topic, messages });
}

module.exports = {
    start,
    stop,
    sendUserLikeUpdate
};
