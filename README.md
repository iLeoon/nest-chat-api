# Nest Chat API

A backend **real-time chat API** built with **NestJS**, designed around **WebSocket-based communication**, session-based authentication, and a MongoDB-backed data layer.  
The project focuses on real-time connections, authentication flows, testing, and production-style backend structure.

---

## Overview

This project demonstrates how to build a real-time chat backend with:

- **WebSocket-based connections** for real-time messaging
- **Session-based authentication**
- **OAuth authentication** using Google and Twitter
- **MongoDB** for persisting users, sessions, and chat-related data
- **Structured logging**
- **Full test coverage** using Jest
- **Dockerized NoSQL database** for local development

The focus is on **connection handling**, **authentication**, and **backend correctness**, rather than frontend concerns.

---

## Repository Separation

This repository contains **only the backend service** for the chat application.

- The **backend** (this repository) is responsible for:
  - Real-time WebSocket communication
  - Authentication and session management
  - Data persistence and business logic
- The [**frontend**](https://github.com/iLeoon/next-chat-app) is implemented in a **separate repository**
  - Communicates with this backend via WebSockets and HTTP APIs
  - Handles UI, client-side state, and user interactions

This separation allows each part of the system to evolve independently and reflects
real-world production architectures.

---

## Tech Stack

### Backend
- **NestJS**
- **WebSockets**
- **MongoDB**
- Session-based authentication
- OAuth (Google, Twitter)
- Structured logging with winston
- Testing with Jest

### Infrastructure
- **Docker**
- **Docker Compose**

---

## Architecture Overview

- The backend exposes a WebSocket server for handling real-time client connections.
- Clients connect over WebSockets and maintain persistent sessions.
- Authentication is handled using:
  - Traditional credential-based login with sessions
  - OAuth login via Google and Twitter
- Session data and user state are persisted in MongoDB.
- Logging is implemented to track connections, authentication events, and system errors.
- The system is designed to be modular and testable.

---

## Real-Time Communication

- Real-time messaging is handled using **WebSockets**.
- Each client maintains a persistent connection to the server.
- Connection lifecycle events (connect, disconnect) are explicitly handled.
- Messages are routed through WebSocket gateways instead of HTTP endpoints.

---


### Authentication Methods
- **Session-based authentication**
- **OAuth authentication**
  - Google
  - Twitter

### Session Handling
- Sessions are persisted in **MongoDB**
- Authenticated users maintain state across WebSocket connections
- Authorization logic is enforced on protected WebSocket events


---

## Database Design (MongoDB)

MongoDB is used to store:

- User accounts
- Authentication and session data
- Chat-related entities (e.g. conversations, messages)


---

## Testing

- The project includes **full test coverage** using **Jest**
- Tests cover:
  - Authentication flows
  - WebSocket handlers
  - Core business logic
- The codebase is structured to allow isolated and repeatable tests



---

## Logging

- Structured logging is implemented across the application
- Logs capture:
  - Connection lifecycle events
  - Authentication attempts
  - Errors and exceptional cases


---

## Environment Configuration

The application uses a local `.env` file for configuration.

The `.env` file is used to configure:
- Database connection
- Session settings
- OAuth credentials
- Application ports

Environment files are created locally and are not committed to version control.

---

## Running the Project Locally

### Start MongoDB (Docker)

```bash
docker-compose up --build
```

### Run the  backend
```
yarn install
yarn start:dev
```
