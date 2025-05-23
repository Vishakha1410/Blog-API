# 📝 Blog API

A secure and role-based RESTful API for managing users, blog posts, and comments, built using Node.js, Express, and MongoDB. This API includes JWT-based authentication and authorization to control access to various resources.

It supports two user roles:

- **Admin**: Has full access to all operations (CRUD on posts, comment management, user management, etc.)
- **User**: Can view blog posts and add comments but cannot create, update, or delete posts.

This structure ensures proper access control and separation of privileges between regular users and administrators.

---

## 🚀 Features

- JWT-based authentication and protected routes
- Role-based access control (admin vs. user)
- Admin can create, read, update, and delete blog posts
- Users can read posts and add, update, or delete their own comments
- Password reset and email verification functionality
- Clean structure using Mongoose models
- Tested and organized using Postman

---

## ▶️ How to Run the Project

1. **Install dependencies**:

```bash
npm install
```

2. **Start the server**:

```bash
node server.js
```

> The server runs on `http://localhost:5000`


---

## 📬 Postman Collection Included

- A Postman collection file (`Blog API.postman_collection.json`) is provided for testing.
- It contains:
  - All API endpoints
  - Request/response formats
  - Authentication and role-based access flow
  - Header and body usage examples

> Import the collection in Postman to test all features directly.
