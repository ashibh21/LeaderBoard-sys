# Real-Time Leaderboard System

## Overview

This project implements a real-time leaderboard system that tracks and ranks users based on their scores in various games or activities. It features user authentication, score submission, real-time leaderboard updates, and top players reporting. The backend is built with Node.js, Express, MongoDB, and Redis, using JWT for secure API access.


## Features

* **User Authentication**: Register and log in with JWT-based authentication.
* **Score Submission**: Submit scores for different games.
* **Real-Time Leaderboard**: Display global and game-specific leaderboards with real-time updates.
* **User Rankings**: View user rankings on the leaderboard.
* **Top Players Report**: Generate reports on the top players for specific periods.

## Technologies Used

* **Node.js**: JavaScript runtime for building the server-side application.
* **Express**: Web framework for Node.js.
* **MongoDB**: NoSQL database for storing user data.
* **Redis**: In-memory data structure store for managing leaderboards with sorted sets.
* **JWT**: JSON Web Tokens for secure authentication.
* **bcrypt**: Library for hashing passwords.
* **Nodemon**: Development tool for automatically restarting the server on code changes.

## Getting Started

### Prerequisites

* Node.js 
* MongoDB (local or cloud instance)
* Redis (local or cloud instance)

### Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/JheyTim/Leaderboard-System.git
    ```

2. **Navigate to the Project Directory**

    ```bash
    cd Leaderboard-System
    ```

3. **Install Dependencies**

    ```bash
    npm install
    ```

4. **Configure Environment Variables**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    PORT=3000
    REDIS_URL=redis://localhost:6379
    JWT_SECRET=your-secret-key
    MONGO_URI=mongodb://localhost:27017/leaderboard
    ```

5. **Start the Application**

    ```bash
    npm start
    ```

    The server will start and listen on `http://localhost:3000`.

## API Endpoints

### Authentication

* **Register**: `POST /auth/register`
    * Request Body: `{ "username": "user", "password": "password" }`
* **Login**: `POST /auth/login`
    * Request Body: `{ "username": "user", "password": "password" }`
    * Response: `{ "message": "Login successful", "token": "jwt_token" }`

### Leaderboard

* **Get Leaderboard for a Game**: `GET /leaderboard/:game`
    * Response: `{ "leaderboard": [ { "value": "user1", "score": 1000 }, ... ] }`
* **Get Global Leaderboard**: `GET /leaderboard/global`
    * Response: `{ "leaderboard": [ { "value": "user1", "score": 1000 }, ... ] }`
* **Get Top N Players for a Specific Game**: `GET /leaderboard/:game/top/:count`
* **Get Top N Players Globally**: `GET /leaderboard/global/top/:count`
    * Response: `{ "topPlayers": [ { "value": "user1", "score": 1000 }, ... ] }`
* **Get User Rank for a Specific Game**: `GET /leaderboard/:game/rank/:username`
    * Response: `{ "username": "user1", "rank": 5, "score": 500 }`
* **Get User Rank Globally**: `GET /leaderboard/global/rank/:username`
    * Response: `{ "username": "user1", "rank": 10, "score": 800 }`

### Score Submission

* **Submit Score**: `POST /score/submit`
    * Request Body: `{ "game": "game1", "score": 1500 }`
    * Headers: `{ "Authorization": "Bearer <jwt_token>" }`
    * Response: `{ "message": "Score submitted successfully" }`
