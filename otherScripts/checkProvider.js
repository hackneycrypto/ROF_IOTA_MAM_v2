// Checks that the provider service is working

const { composeAPI } = require('@iota/core');

const iota = composeAPI({
    provider: 'https://permanode.thetangle.business:443?Authorization=32160e3d155c33d56061c8bfdaf82f1a3b7a9820026f8fc94c5017c25fc54138'
})

iota.getNodeInfo()
    .then(info => console.log(info))
    .catch(error => {
        console.log(`Request error: ${error.message}`)
    })