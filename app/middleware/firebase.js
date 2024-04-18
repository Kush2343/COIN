const admin = require('firebase-admin')

var serviceAccount = require('../../aslcrypto-firebase-adminsdk-9qs3j-e081f28ad7.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://aslcrypto.appspot.com', // Replace with your storage bucket URL
});

module.exports = admin;