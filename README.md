# 📝 VReal soft test task

**VReal soft test task** is a full-stack application built with **Next.js** frontend and **NestJS** backend, organized as a monorepo using **npm workspaces**.

This guide explains how to install, run, and build the project.

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.0-61dafb?logo=react&logoColor=white" alt="React version" /> 
  <img src="https://img.shields.io/badge/NestJS-11.x-e0234e?logo=nestjs&logoColor=white" alt="NestJS version" /> 
  <img src="https://img.shields.io/badge/Next.js-16.0.3-000000?logo=next.js&logoColor=white" alt="Next.js version" />
  <img src="https://img.shields.io/badge/Node.js-22.x-43853d?logo=node.js&logoColor=white" alt="Node.js version" />
</p>

---

## ⚙️ Requirements

Before you start, make sure you have the following installed:

- **Node.js v22.x**
- **npm** package manager
- **Git** for cloning and version control

---

## 📦 Quick Start

Using **npm**:

```bash
# 1. Install dependencies
npm install or npm install --force

# 2. Start the development server (with hot reload)
npm run dev
```

---

## 📚 API Documentation

The API documentation is available via Swagger UI when the backend server is running:

- **Swagger UI**: http://localhost:4000/api/docs

The documentation includes:
- All available endpoints
- Request/response schemas
- Authentication requirements
- Example requests and responses

### Authentication

Most endpoints require JWT authentication. You can authenticate by:
1. Using the `/api/auth/sign-up` or `/api/auth/sign-in` endpoints
2. The access token will be stored in an HTTP-only cookie
3. For Swagger UI, use the "Authorize" button to add a Bearer token
