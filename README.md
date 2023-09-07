<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Blog Platform Project

This repository contains the backend code for a simple blog platform built with NestJS, TypeORM, and Swagger.

## Introduction

This project provides the backend functionality for a basic blogging platform using the NestJS framework. It includes features such as user registration, authentication, blog creation, and commenting.

## Features

- User Registration
- User Authentication (JWT-based)
- Blog Creation and Management
- Commenting on Blogs

## Getting Started

### Prerequisites

Before you begin, ensure you have the following:

- Node.js
- npm
- MySQL

### Installation

1. Clone the repository:

```bash
git clone https://github.com/tirthacodes/nestjs-blog-platform.git
```

2. Navigate to the project folder:

```bash
cd nestjs-blog-platform
```

3. Install dependencies:

```bash
npm install
```

4. Set up the database:

   - Create a new MySQL database.
   - Configure the database connection in `app.module.ts`.

5. Run the application:

```bash
npm run start:dev
```

## Usage

- Register a new user or log in with an existing account.
- Create new blogs and manage them from the dashboard.
- View and comment on blogs created by other users.

## API Documentation

The API documentation is generated using Swagger. You can access it at [http://localhost:3000/api/](http://localhost:3000/api/).

## Folder Structure

- `src/`: Contains the source code for the backend.
- `test/`: Contains unit and integration tests.
- `...

## Contributing

Contributions are welcome! If you find a bug or have a suggestion, please open an issue or create a pull request.

