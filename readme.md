# DynamoDB Eloquent

DynamoDB Eloquent is an ORM that can run in NodeJS, and can be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8).

## Features

## Quick Start

```bash
npm i dynamodb-eloquent
```

## Config AWS credentials
### Using environment variables
```bash
# .env
DDB_ENDPOINT=
AWS_REGION=

## way 1: using aws profile
AWS_PROFILE=
## way 2: using aws access key
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```
### Dynamically set credentials
```ts
ddbRepo.setConfig({
  accessKeyId: 'AKIAxxx',
  secretAccessKey: 'xxxxxx',
  region: 'ap-northeast-1',
});
```
```ts
ddbRepo.setConfig({
  profile: 'your-aws-profile',
  region: 'ap-northeast-1',
});
```


## Usage

### Basic query

```ts
import { DynamoDBRepository } from "dynamodb-eloquent";

export class UserRepository extends DynamoDBRepository {
  protected table = `Users`;

  // Please put all indexes you have here
  protected mappingIndex = {
    email: "email",
  };
}

const userRepository = new UserRepository();

// Create
await userRepository.create({
  id: 1,
  name: "Bill",
});
// Update
await userRepository.update({
  id: 1,
  name: "John",
});
// List
await userRepository.findAll();
// Show
await userRepository.findOrFail(userId);
// Delete
await userRepository.delete(userId);

// Delete
await userRepository.delete(userId);
```
## Filter
### findBy
`findBy` must use with `index`
```js
// Filter
const params = { email: "abc@example.com" };
const indexName = "email";
const posts = await userRepository.findBy(params, indexName);
```
### findBy
`findBy` must includes the `index`
```js
const params = { email: "abc@example.com" };
const indexName = "email";
const users = await userRepository.findBy(params, indexName);
console.log(users.length)
```
### findOneBy
`findOneBy` must includes the `index`
```js
const params = { email: "bill001@example.com" };
const indexName = "email";
const user = await userRepository.findOneBy(params, indexName);
console.log(user.id)
```
### ScanData
```ts
const where = {
  category: 'Clothes',
  // additional conditions
};
const page1 = await postRepository.scanDataV2({ filter: where });
const page2 = await postRepository.scanDataV2({ filter: where, nextKey: page1.nextKey });
```

### paginate
```js
const nextKey = undefined; // put nextKey here
const limit = 10;
const params = {
  limit,
  nextKey,
  scanIndexForward: false,
};
const posts = await postRepository.paginate(params);
// result
{
  data: [
    { id: 'aa03e3a0-a9c8-439f-9b22-362ea59fc0ec', email: 'bill001@example.com'},
    { id: '527a850f-0bfc-4da5-84d3-8a03c451e868', email: 'bill002@example.com'},
    ...
    { id: '527a850f-0bfc-4da5-84d3-8a03c451e868', email: 'bill010@example.com'},
  ],
  pagination: {
    nextKey: 'eyJpZCI6ImFlMWRmYTRjLTM1NTUtNDM0ZC05NWU1LWFkZWVhMjllZDE1OCJ9',
    count: 10,
    perPage: 10
  }
}
```

### paginateV2
```js
const page1 = await postRepository.paginateV2({ limit: 10 });
const page2 = await postRepository.paginateV2({ limit: 10, nextKey: page1.pagination.nextKey });
```

### Migrations

#### Update `package.json`

```json
"scripts": {
  "migration:create": "dynamodb_eloquent migration:create",
  "migration:run": "dynamodb_eloquent migration:run",
  "migration:revert": "dynamodb_eloquent migration:revert",
}
```

#### Run commands

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
