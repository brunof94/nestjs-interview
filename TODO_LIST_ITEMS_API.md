# TodoList Items API

This document describes the API endpoints for managing TodoList items with built-in validation.

## Prerequisites

Each TodoList can contain multiple TodoListItems. A TodoListItem has the following attributes:
- `id`: number (auto-generated)
- `title`: string (required, 1-200 characters)
- `completed`: boolean (optional, defaults to false)

## Validation Rules

### TodoList Validation
- `name`: Required string, 1-100 characters

### TodoListItem Validation
- `title`: Required string, 1-200 characters
- `completed`: Optional boolean

### Parameter Validation
- `todoListId`: Must be a positive integer
- `itemId`: Must be a positive integer

## API Endpoints

### Get all TodoListItems in a TodoList
```
GET /api/todolists/:todoListId/items
```

**Parameters:**
- `todoListId`: Positive integer

**Response:**
```json
[
  {
    "id": 1,
    "title": "Sample task",
    "completed": false
  }
]
```

### Get a specific TodoListItem
```
GET /api/todolists/:todoListId/items/:itemId
```

**Parameters:**
- `todoListId`: Positive integer
- `itemId`: Positive integer

**Response:**
```json
{
  "id": 1,
  "title": "Sample task",
  "completed": false
}
```

### Create a new TodoListItem
```
POST /api/todolists/:todoListId/items
```

**Parameters:**
- `todoListId`: Positive integer

**Request Body:**
```json
{
  "title": "New task",
  "completed": false
}
```

**Validation Rules:**
- `title`: Required, 1-200 characters
- `completed`: Optional boolean

**Response:**
```json
{
  "id": 1,
  "title": "New task",
  "completed": false
}
```

### Update a TodoListItem
```
PUT /api/todolists/:todoListId/items/:itemId
```

**Parameters:**
- `todoListId`: Positive integer
- `itemId`: Positive integer

**Request Body:**
```json
{
  "title": "Updated task",
  "completed": true
}
```

**Validation Rules:**
- `title`: Optional, 1-200 characters if provided
- `completed`: Optional boolean

**Response:**
```json
{
  "id": 1,
  "title": "Updated task",
  "completed": true
}
```

### Delete a TodoListItem
```
DELETE /api/todolists/:todoListId/items/:itemId
```

**Parameters:**
- `todoListId`: Positive integer
- `itemId`: Positive integer

**Response:** 200 OK (no content)

## Error Responses

### Validation Errors (400 Bad Request)
```json
{
  "statusCode": 400,
  "message": [
    "title should not be empty",
    "title must be longer than or equal to 1 characters"
  ],
  "error": "Bad Request"
}
```

### Common Validation Errors

**TodoList Name Validation:**
- "name should not be empty"
- "name must be a string"
- "name must be longer than or equal to 1 characters"
- "name must be shorter than or equal to 100 characters"

**TodoListItem Title Validation:**
- "title should not be empty"
- "title must be a string"
- "title must be longer than or equal to 1 characters"
- "title must be shorter than or equal to 200 characters"

**Parameter Validation:**
- "todoListId must be a positive number"
- "todoListId must be an integer number"
- "itemId must be a positive number"
- "itemId must be an integer number"

## Example Usage

1. Create a TodoList with validation:
```bash
curl -X POST http://localhost:3000/api/todolists \
  -H "Content-Type: application/json" \
  -d '{"name": "My TodoList"}'
```

2. Create a TodoListItem with validation:
```bash
curl -X POST http://localhost:3000/api/todolists/1/items \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "completed": false}'
```

3. Invalid request (will return 400 Bad Request):
```bash
curl -X POST http://localhost:3000/api/todolists/1/items \
  -H "Content-Type: application/json" \
  -d '{"title": "", "completed": "invalid"}'
```

## Notes

- All input data is validated using class-validator
- Invalid data will return a 400 Bad Request with detailed error messages
- Parameter validation ensures IDs are positive integers
- String fields have length constraints to prevent abuse
- The `completed` field defaults to `false` when creating a new item if not specified
- Properties not defined in DTOs are automatically filtered out (whitelist: true)
- Unknown properties in request bodies will cause validation errors (forbidNonWhitelisted: true)
