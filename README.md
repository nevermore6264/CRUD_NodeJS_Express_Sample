# Database Schema

## 1. Tables

### Users

| Column    | Type             | Constraints |
| --------- | ---------------- | ----------- |
| id        | Primary Key      |             |
| username  | Unique, Required |             |
| email     | Unique, Required |             |
| password  | Required         |             |
| role      | (Admin, User)    |             |
| createdAt |                  |             |
| updatedAt |                  |             |

### Categories

| Column      | Type             | Constraints |
| ----------- | ---------------- | ----------- |
| id          | Primary Key      |             |
| name        | Unique, Required |             |
| description | Optional         |             |
| createdAt   |                  |             |
| updatedAt   |                  |             |

### Authors

| Column    | Type        | Constraints |
| --------- | ----------- | ----------- |
| id        | Primary Key |             |
| name      | Required    |             |
| bio       | Optional    |             |
| createdAt |             |             |
| updatedAt |             |             |

### Stories

| Column      | Type                               | Constraints |
| ----------- | ---------------------------------- | ----------- |
| id          | Primary Key                        |             |
| title       | Required                           |             |
| content     | TEXT, Required                     |             |
| publishedAt | Date of publication                |             |
| status      | (Published, Draft)                 |             |
| authorId    | Foreign Key, references Authors    |             |
| categoryId  | Foreign Key, references Categories |             |
| createdAt   |                                    |             |
| updatedAt   |                                    |             |

### Comments

| Column    | Type                            | Constraints |
| --------- | ------------------------------- | ----------- |
| id        | Primary Key                     |             |
| content   | TEXT, Required                  |             |
| storyId   | Foreign Key, references Stories |             |
| userId    | Foreign Key, references Users   |             |
| createdAt |                                 |             |
| updatedAt |                                 |             |

### Favorites

| Column    | Type                            | Constraints |
| --------- | ------------------------------- | ----------- |
| id        | Primary Key                     |             |
| storyId   | Foreign Key, references Stories |             |
| userId    | Foreign Key, references Users   |             |
| createdAt |                                 |             |

## 2. Relationships

- Users can have multiple Comments and Favorites.
- Stories belong to one Category and one Author, but a Category can have many Stories, and an Author can write many Stories.
- Stories can have multiple Comments and can be favorited by multiple Users.

HieuTT121