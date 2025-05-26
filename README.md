# Task Management API

A RESTful API for managing tasks, built with Node.js, Express, and PostgreSQL.

## Features

- JWT-based authentication
- CRUD operations for tasks
- Task status tracking
- Time tracking
- Task reporting
- Input validation
- Error handling
- Pagination and filtering

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- TypeScript
- JWT for authentication
- Zod for validation
- bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd task-management
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-in-production
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/task_management
ADMIN_SECRET=your-desire-secret-id


```

4. Create the database:

```bash
createdb task_management
```

5. Run migrations:

```bash
npm run migrate
```

6. Start the server:

```bash
npm run dev
```

## API Endpoints

### Authentication

- POST /api/users/signup - Signup a new user

Admin and the regular users uses one endpoint to signup
User:
{
"firstName":
"lastName":
"email" :
"password":
}

Admin
{
"firstName":
"lastName":
"email" :
"password":
"adminSecret" :your secret key inside the env
}

- POST /api/users/login - Login user

### Tasks

- POST /api/tasks - Create a new task
- GET /api/tasks - List all tasks (with pagination and filtering)
- PATCH /api/tasks/:id - Update a task
- DELETE /api/tasks/:id - Delete a task
- GET /api/tasks/report - Get task completion report
- GET /api/tasks/report-time - Get task completion report

## API Usage Examples

### Create a Task

```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the task management API",
    "priority": "HIGH",
    "dueDate": "2024-03-20T00:00:00Z"
  }'
```

### Get Tasks with Pagination

```bash
curl -X GET "http://localhost:3001/api/tasks?page=1&limit=10&status=IN_PROGRESS" \
  -H "Authorization: Bearer <your-token>"
```

### Update Task

```bash
curl -X PUT http://localhost:3001/api/tasks/<task-id> \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "COMPLETED",
    "timeSpent": 120
  }'
```

## Error Handling

The API uses a centralized error handling system that returns errors in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "data": null
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
