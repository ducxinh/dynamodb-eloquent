# DynamoDB Eloquent

DynamoDB Eloquent is an ORM that can run in NodeJS, and can be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8).

## Features

## Quick Start

```bash
npm i dynamodb-eloquent
```

## Usage
### Basic query
```ts
import { DynamoDBRepository } from "dynamodb-eloquent";

export class UserRepository extends DynamoDBRepository {
  protected table = `Users`;
}

const userRepository = new UserRepository();

// Create
await userRepository.create({
  id: 1,
  name: 'Bill',
})
// Update
await userRepository.update({
  id: 1,
  name: 'John',
});
// List
await userRepository.findAll();
// Show
await userRepository.findOrFail(userId);
// Delete
await userRepository.delete(userId);
```

### Migrations
```json
"scripts": {
  "migration:create": "dynamodb_eloquent migration:create",
  "migration:run": "dynamodb_eloquent migration:run",
  "migration:revert": "dynamodb_eloquent migration:revert",
}
```
```bash
# For local
# export AWS_REGION="ap-northeast-1"
# export DDB_ENDPOINT="http://localhost:8000"

# Generate new migration
yarn migration:create --table Posts

# Run migrations
yarn migration:run
# Or yarn migration:run --tableSuffix test


# revert migrations
yarn migration:revert
# or yarn migration:revert --tableSuffix test
```