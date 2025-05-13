# CUpido

**CUpido** is a modern CUHK-themed dating web app built with ASP.NET Core (.NET 7) and Angular 14. It connects students and young professionals through intelligent matching, real-time chat, and an anonymous confession board.

## 🚀 Features

- 💘 **Matching System** – Compatibility-based profile recommendations
- 💬 **Real-time Messaging** – Live chat with read receipts
- 🕵️ **Confession Board** – Anonymous posts within CUHK community
- 🔐 **CUHK Email Verification** – Secure registration/login
- 🌈 **Likes System** – Filter by "Members I Like" and "Members Who Like Me"
- 🛠 **Admin Panel** – User roles, photo moderation, and audit logs
- 🎨 **Themed UI** – Colors inspired by CUHK and romantic tones

## 🆕 Enhancements

- Database upgrade: SQLite → PostgreSQL for better concurrency
- JWT optimization with embedded roles
- Standardized JSON error responses (RFC 7807)
- API Pagination support

## 🐛 Bug Fixes

- Fixed race conditions with duplicate "like"
- Resolved SignalR group naming collisions

## ⚠️ Breaking Changes

| Component     | Change                                   |
|---------------|------------------------------------------|
| Database      | Now defaults to PostgreSQL               |
| API Routes    | All endpoints now under `/api/*`         |
| Token TTL     | Reduced from 7 days → 3 days             |

## ⚙️ System Requirements

- **Server**: Docker 20+, .NET 7, 1+ vCPU, 1+ GB RAM
- **Database**: PostgreSQL 14+
- **Client**: Chrome/Edge ≥ 115, Safari ≥ 15, Firefox ≥ 110

## 🛠️ Development

```bash
git clone https://github.com/CSCI3100-CUpido/cupido.git
cd cupido
docker compose up -d
cd client
npm install
ng serve
```

## 🔧 Production
```bash
docker build -t CUpido .
docker run -d -p 8080:8080 \
  -e "TokenKey=<your-jwt-secret>" \
  --link postgres-db CUpido

```

## 👤 End-User Guide

- Register: /register
- Create profile, upload photo
- Browse and like members
- Chat opens automatically with mutual likes
- Manage account and interests

## 📎 GitHub Repository

Please visit our project repository at:  
[https://github.com/CSCI3100-CUpido/cupido](https://github.com/CSCI3100-CUpido/cupido)

## 🌿 Branches Overview

- `main`: Stable production-ready codebase for deployment.  
- `feature/feaure_branch_name`: Individual feature branches used for developing new components or functionalities (e.g., `feature/confession-board`). 

**Note:**  All remote feature branches have been deleted to keep the remote environment clean.  The full branching history can still be viewed by cloning the repository locally and using tools like **Git Graph** in VS Code.

