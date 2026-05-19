const mongoose = require('mongoose');


const connectionDB = async() => {
    console.log(process.env.DATABASE_CONNECTION_KEY)
    await mongoose.connect(process.env.DATABASE_CONNECTION_KEY)
}

module.exports = connectionDB

// connectionDB().then(() => console.log('connect DB')).catch((err) => console.error('db not connect'))