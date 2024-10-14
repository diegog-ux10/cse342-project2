const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { initDb } = require('./database/database');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

initDb((err, db) => {
  if (err) {
    console.error('Failed to connect to the database:', err);
    process.exit(1);
  } else {
    console.log('Connected to MongoDB');
    
    app.use('/', routes);
    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Swagger UI is available at http://localhost:${port}/api-docs`);
    });
  }
});