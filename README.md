# Movie and Director Management API

This is a RESTful API for managing a collection of movies and directors. It provides endpoints for creating, reading, updating, and deleting movie and director information.

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [API Endpoints](#api-endpoints)
7. [Authentication](#authentication)
8. [Error Handling](#error-handling)
9. [Testing](#testing)
10. [Deployment](#deployment)

## Features

- User authentication using JWT
- CRUD operations for movies and directors
- Data validation
- Error handling
- API documentation with Swagger

## Prerequisites

- Node.js (v14 or later)
- MongoDB

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/movie-director-api.git
   cd movie-director-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory with the following content:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   JWT_SECRET=your_jwt_secret
   ```
   Replace `your_mongodb_connection_string` with your actual MongoDB connection string and `your_jwt_secret` with a secure random string.

## Running the Application

1. Start the server:
   ```
   npm start
   ```

2. The API will be available at `http://localhost:3000`

3. Access the Swagger documentation at `http://localhost:3000/api-docs`

## API Endpoints

### Authentication

- POST /auth/login - Authenticate a user and get a JWT token

### Movies

- GET /movies - Get all movies
- GET /movies/{id} - Get a specific movie
- POST /movies - Create a new movie (requires authentication)
- PUT /movies/{id} - Update a movie (requires authentication)
- DELETE /movies/{id} - Delete a movie (requires authentication)

### Directors

- GET /directors - Get all directors
- GET /directors/{id} - Get a specific director
- POST /directors - Create a new director (requires authentication)
- PUT /directors/{id} - Update a director (requires authentication)
- DELETE /directors/{id} - Delete a director (requires authentication)

## Authentication

To access protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests. In case of errors, a JSON response with an error message is returned.

## Testing

To run tests:

```
npm test
```

## Deployment

This API can be deployed to various cloud platforms. Make sure to set the appropriate environment variables in your deployment environment.

For detailed API documentation, please refer to the Swagger documentation available at `/api-docs` when the server is running.