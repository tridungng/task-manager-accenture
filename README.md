# Task Manager

A simple full-stack CRUD Task Manager application.

## Tech stack

### Frontend:

- React
- TypeScript
- Vite

### Backend:

- Java 17+
- Spring Boot
- Spring Data JPA
- H2
- Maven

## Prerequisites

- Java 17+
- Maven
- Node.js 18+
- npm

## Running backend

```bash
cd backend
mvn spring-boot:run
```

Backend will be available at: http://localhost:8080

## Running frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: http://localhost:5173

## API endpoints

```
GET    /api/tasks
GET    /api/tasks/{id}
POST   /api/tasks
PUT    /api/tasks/{id}
DELETE /api/tasks/{id}
```

## Testing

Backend:

```bash
cd backend
mvn test
```

Frontend build verification:

```bash
cd frontend
npm run build
```