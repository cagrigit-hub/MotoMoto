# MotoMoto - Motorcycle Booking Website

MotoMoto is a web application that allows users to rent motorcycles from other users. Users can share their motorcycles for rent, and other users can browse and book available motorcycles.

## Used Technologies
MongoDB, PostgreSQL (both dockerized), future Redis.
Kafka as a message broker
%100 Typescript
JWT -> both session and token strategies
express.js
next.js
Solidity
2 own custom libraries -> common + abi_extractor
1 own written Solidity real-time listener, without using any 3rd party due to increase performance.

## Features

- User registration and login with JWT authentication.
- User roles: Regular users and administrators.
- Secure password hashing with bcrypt.
- Motorcycle listing and booking.
- Token-based authentication using JWT (JSON Web Tokens).
- Token refresh mechanism for obtaining new access tokens.
- MongoDB for storing user data and motorcycle listings.
- Express.js and Node.js for the backend.
- Next.js for the frontend.
- GraphQL API for flexible data querying (optional).

## Prerequisites

- Node.js (version X.X.X)
- MongoDB database
- ...

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/cagrigit-hub/MotoMoto.git
cd MotoMoto

Install dependencies:
npm install

Create a .env file based on .env.example and fill in the necessary values.
npm start

Usage
Register a new user account and log in.
Browse available motorcycles listed by other users.
Book a motorcycle for a specified duration.
...
API Endpoints
POST /api/v1/users/register: Register a new user.

POST /api/v1/users/login: Log in and obtain access and refresh tokens.

POST /api/v1/users/refresh: Refresh an expired access token.

...

Contributing
Contributions are welcome! If you find a bug or have an improvement, please create an issue or submit a pull request.

License
This project is licensed under the MIT License.

Contact
For any inquiries, please contact @kutay_ok


Feel free to copy and paste this markdown template into your README.md file and customize it according to your project's details.

