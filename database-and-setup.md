
# 🛠️ Database Schema and Setup – Blog API

This file describes the MongoDB schema design and how the database connection is handled in the Blog API project.

---

## 📊 Database Schema

The application uses MongoDB with Mongoose. Collections are auto-created based on the following schemas:

---

### 👤 Users Collection

| Field              | Type     | Required | Description                           |
|-------------------|----------|----------|---------------------------------------|
| name              | String   | ✅ Yes   | User's full name                      |
| email             | String   | ✅ Yes   | Unique email address (lowercased)     |
| password          | String   | ✅ Yes   | Hashed password (hidden by default)   |
| gender            | String   | ✅ Yes   | Enum: male, female, other             |
| country           | String   | ❌ No    | Country of the user                   |
| role              | String   | ✅ Yes   | Enum: user or admin                   |
| emailVerified     | Boolean  | ❌ No    | Defaults to false                     |
| resetCode         | String   | ❌ No    | Code for password reset               |
| resetCodeExpires  | Date     | ❌ No    | Expiry of the reset code              |
| createdAt, updatedAt | Date | Auto     | Mongoose-managed timestamps           |

---

### 📝 Posts Collection

| Field      | Type     | Required | Description                        |
|------------|----------|----------|------------------------------------|
| title      | String   | ✅ Yes   | Blog post title                    |
| content    | String   | ✅ Yes   | Blog post content                  |
| author_id  | ObjectId | ✅ Yes   | Refers to a User (_id)             |
| createdAt, updatedAt | Date | Auto | Managed by Mongoose                |

---

### 💬 Comments Collection

| Field      | Type     | Required | Description                        |
|------------|----------|----------|------------------------------------|
| postId     | ObjectId | ✅ Yes   | Refers to a Post                   |
| content    | String   | ✅ Yes   | Comment text                       |
| author_id  | ObjectId | ✅ Yes   | Refers to a User (_id)             |
| created_at | Date     | ✅ Yes   | Mongoose-managed timestamp         |

---

## ⚙️ Database Setup

The MongoDB connection is handled in the main `server.js` file using Mongoose:

```js
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("Server Running on port 5000")))
  .catch((err) => console.log(err));
```

> Environment variables like `MONGO_URI` and `JWT_SECRET` are configured in the `.env` file.

No separate setup script is required. Collections are automatically created when the server runs and the models are loaded.

---

✅ This satisfies the "Database schema and setup scripts" deliverable.
