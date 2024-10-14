const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;

let _db;

const initDb = (callback) => {
   if(_db) {
       console.warn('Trying to init DB again!');
       return callback(null, _db);
   }
   MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
         _db = client.db(); // Aquí obtenemos la base de datos
         callback(null, _db);
    })
    .catch((err) => {
         callback(err);
    });
}

const getDb = () => {
    if (!_db) {
        throw Error('Db has not been initialized. Please call init first.');
    }
    return _db;
}

module.exports = { initDb, getDb };