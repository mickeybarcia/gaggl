const { Storage } = require('@google-cloud/storage');

const config = require('../config');

const googleCloudStorage = new Storage({ 
    projectId: config.imageStorage.projectId,
    credentials: JSON.parse(config.imageStorage.storageKey)
});
const bucket = googleCloudStorage.bucket(config.imageStorage.projectId); 

async function saveImage(buffer, fileName) {
    await bucket.file(fileName).save(buffer)
    await bucket.file(fileName).makePublic()
}

async function getImage(filename) {
    const data = await bucket.file(filename).download();
    return data[0];
}

async function deleteImage(filename) {
    await bucket.file(filename).delete();
}

module.exports = { saveImage, getImage, deleteImage };