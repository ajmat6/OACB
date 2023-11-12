const crypto = require('crypto')

exports.createRandomBytes = () => new Promise ((resolve, reject) => {
    crypto.randomBytes(20, (error, buffer) => { // 20 length token and gives a callback function with either error or buffer
        // if error comes:
        if(error) reject(error);

        const token = buffer.toString('hex') // using hex encoding method to store token
        resolve(token)
    })
})