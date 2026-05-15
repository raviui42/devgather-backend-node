const mongoose = require('mongoose');


const connectionDB = async() => {
    await mongoose.connect('mongodb+srv://mynode:test1234@cluster0.elqdi1b.mongodb.net/devgather')
}

module.exports = connectionDB

// connectionDB().then(() => console.log('connect DB')).catch((err) => console.error('db not connect'))