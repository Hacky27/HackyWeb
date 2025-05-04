# Lab-Backend

**Lab-Backend** is a robust backend API designed to handle Admin interaction and athelits.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)

## Features

- **User Management:** Register, login, and manage user profiles.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for building the API.
- **MongoDB**: NoSQL database for storing all data.
- **Mongoose**: MongoDB object modeling for Node.js.
- **JWT (JSON Web Token)**: For authentication and authorization.
- **bcrypt.js**: For password hashing and security.

## Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** (Node package manager)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/SoftwareGiant/Athleticswebsite.git
    ```

2. Navigate into the project directory:

    ```bash
    cd Lab-Backend
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

## Environment Variables

Set up your environment variables by creating a `.env` file in the root directory and adding the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
