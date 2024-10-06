# Event Management API

The **Event Management API** is a backend system that handles user authentication, event creation, ticket reservation, and waiting list management. It leverages RabbitMQ for managing reservation queues and PostgreSQL as the database. This API is designed using Node.js with Express and Sequelize as ORM for database interaction.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
  - [Running with Docker Compose](#running-with-docker-compose)
  - [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Tests](#tests)

## Features

- User authentication (sign-up, login)
- Create events
- Book tickets for an event
- Manage waiting lists for events
- Cancel reservations and assign tickets to users on the waiting list
- Integration with RabbitMQ for asynchronous ticket reservations

## Technologies Used

- **Node.js**: Server-side runtime environment.
- **Express.js**: Web framework for Node.js.
- **Sequelize**: ORM for managing PostgreSQL.
- **PostgreSQL**: Relational database management.
- **RabbitMQ**: Message broker for asynchronous reservation handling.
- **Redis**: In-memory data structure store (optional for caching).
- **Docker**: Containerization platform.
- **Docker Compose**: For orchestrating multi-container Docker applications.

## Setup and Installation

### Prerequisites

- Node.js and npm installed
- Docker and Docker Compose installed
- PostgreSQL installed (for local setup)

### Running with Docker Compose

1. **Clone the repository**:

   Clone the project from your version control system.

2. **Create a `.env`  and `.env.compose`(for docker compose) files**: Copy the `.env.example` and configure your environment variables.

3. **Build and run the Docker containers**:

   Use the `docker-compose --env-file .env.compose up`

   Build and start all containers defined in the Docker Compose file.

4. **Docker Compose Services**:

   - **PostgreSQL**: Running on port `5432`
   - **RabbitMQ**: Running on port `5672` (RabbitMQ management interface on port `15672`)
   - **API**: Available on port `3000`

   Access the app at: `http://localhost:3000`

5. **Stopping the containers**:

   Use the `docker-compose down` command to stop and remove containers.

### Running Locally

1. **Clone the repository**:

   Clone the project to your local machine.

2. **Install dependencies**:

   Run `npm install` to install all required packages.

3. **Create and configure `.env`**:

   Copy the `.env.example` file and configure the environment variables.

4. **Start PostgreSQL and RabbitMQ**:

   Ensure PostgreSQL and RabbitMQ are running locally.

5. **Run database migrations**:

   Use the Sequelize CLI to run the migrations.

6. **Start the application**:

   Use the `npm start` command to start the server. The application will run on `http://localhost:3000`.

## API Endpoints

### Auth

- **POST** `/api/user/signup`

  - Request Body: `{ "email": "user@example.com", "password": "password" }`
  - Response: `{ "message": "User created successfully", "data": {...} }`

- **POST** `/api/auth/signin`
  - Request Body: `{ "email": "user@example.com", "password": "password" }`
  - Response: `{ "message": "Login successful", "accessToken": "..." }`

### Event

- **POST** `/api/event/initialize`

  - Request Body: `{ "name": "Event Name", "totalTickets": 50 }`
  - Response: `{ "message": "Event created successfully", "data": {...} }`

- **GET** `/api/event/:eventId`
  - Response: `{ "message": "Event fetched successfully", "data": {...} }`

### Reservation

- **POST** `/api/reservation/create`

  - Request Body: `{ "eventId": "event-uuid" }`
  - Response: `{ "message": "Reservation queued successfully", "status": "booked" }`

- **POST** `/api/reservation/cancel`

  - Request Body: `{ "eventId": "event-uuid" }`
  - Response: `{ "message": "Reservation canceled" }`

- **GET** `/api/status/:eventId`
  - Response: `{ "EventId": "...", "availableTickets": 5, "waitingList": 3 }`

## API Documentation

For detailed API documentation and examples, refer to the [Postman Documentation](https://documenter.getpostman.com/view/21554629/2sAXxLCuac).

### Environment Variables

The application uses the following environment variables. Make sure they are set in your `.env` file.

```env
DB_USER='your_postgres_user'
DB_HOST='localhost'
DB_NAME='your_database_name'
DB_PASSWORD='your_db_password'
DB_PORT=5432
RABBITMQ_URL='amqp://rabbitmq:rabbitpassword@localhost:5672'
REDIS_URL='redis://localhost:6379'
ACCESS_TOKEN_SECRET='your_secret_key'
REFRESH_TOKEN_SECRET='your_refresh_secret'
```

### Tests

The application uses **Jest** for unit and integration tests.

1. **Running Tests**:

   Run `npm test` to execute the tests.

2. **Test Coverage**:

   Run `npm run test:coverage` to get test coverage reports.

## API Deployed Link [Evently](http://102.37.149.66:3000/)
