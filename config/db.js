const mongoose = require('mongoose');
require('dotenv').config();

const database_connection = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,

        });

        console.log(`Database connected: ${conn.connection.host}`);

    } catch (error){
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports=database_connection;
