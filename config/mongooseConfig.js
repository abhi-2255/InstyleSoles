const mongoose = require('mongoose')

const connectMongoose = async () => {
    try {
        mongoose.connect('mongodb://localhost:27017/instyleSoles')

        mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB')
        })

        mongoose.connection.on('error', (err) => {
            console.log('Error connecting to MongoDB')
        })

        mongoose.connection.on('disconnected', () => {
            console.log('Disconnected to MongoDB')
        })

    }
    catch (err) {
        console.log('Error')
    }
}

module.exports = connectMongoose