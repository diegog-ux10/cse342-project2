const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Express API for Movies and Directors',
        description: 'This is a simple Express API for managing Movies and Directors.',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);