# CRM Backend

Backend service for the iAtlas Study CRM. Manages customer relationships, user authentication, and data import/export.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)

## Prerequisites
- **Node.js**: v14+ (Recommended v18 or v20)
- **MongoDB**: A valid MongoDB connection string (Atlas or local)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd crm-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory. The application constructs the MongoDB connection string using separate component variables.

### Required Environment Variables:

```env
# Database Credentials & Config
DBUSER_NAME=your_db_username
DBUSER_PASSWORD=your_db_password
DB_NAME=your_database_name
# Connection string is built as:
# mongodb+srv://${DBUSER_NAME}:${DBUSER_PASSWORD}@cluster0.uimjwsj.mongodb.net/${DB_NAME}...

# Security
JWT_SECRET=your_jwt_secret_key
```

> **Note**: The application currently listens on a **hardcoded port 3000**.
> See `index.js` line 36 to modify this if needed.

## Running the Application

Start the server (uses `nodemon` for file watching):
```bash
npm start
```
This runs `nodemon index.js`.

## Project Structure

- **`index.js`**: Entry point. Sets up Express, middleware, and connects to DB.
- **`src/`**:
  - **`config/`**: Database connection (`db.js`).
  - **`controller/`**: request handlers (logic).
  - **`middlewares/`**: Auth and verify tokens.
  - **`models/`**: Mongoose schemas.
  - **`router/`**: API route definitions.
  - **`utils/`**: Helper functions.

## API Info
- Base URL: `http://localhost:3000` (default)
- CORS configured for:
  - `http://localhost:5173`
  - `https://crm.iatlasstudy.com`
  - `https://sensational-kheer-8f473b.netlify.app`
