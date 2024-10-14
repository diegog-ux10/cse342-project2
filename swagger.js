const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Movie Collection API',
    description: 'This is an Express API for managing a collection of movies and directors',
  },
  host: 'localhost:3000',
  schemes: ['https'],
  tags: [
    {
      name: 'Movies',
      description: 'API endpoints for managing movies'
    },
    {
      name: 'Directors',
      description: 'API endpoints for managing directors'
    }
  ],
  definitions: {
    Movie: {
      title: 'Inception',
      director: '60d725397de5c63b4a7e3b1e',  // ObjectId as string
      releaseYear: 2010,
      genre: ['Science Fiction', 'Action'],
      rating: 8.8,
      duration: 148,
      cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page']
    },
    Director: {
      name: 'Christopher Nolan',
      birthYear: 1970,
      nationality: 'British-American'
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);