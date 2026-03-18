#  Rule Based Content Filter

## Overview

This project is a Rule-Based Content Filter application built with **React (Vite + TypeScript)** and **Node.js (Express)**.
The app allows users to create rules and process text dynamically by applying highlights or tooltips based on defined conditions.

---

## Features

* Create, update, delete rules (CRUD)
* Highlight specific words in text
* Add tooltips to matched words
* Different match types:

  * contains
  * startsWith
  * exact
* Real-time text processing

---

## Tech Stack

**Frontend:**

* React (Vite)
* TypeScript

**Backend:**

* Node.js
* Express.js
* SQLite3

---

## Project Structure

```
rulebased-content-filter/
│
├── backend/
│   ├── database/
│   │   └── db.js
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── rules.db
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── types/
│   │   │   └── rule.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   └── package.json
│
└── README.md
```

---

##  Setup Instructions

###  1. Clone the repository

```
git clone https://github.com/AnilaJanuzi/rulebased-content-filter.git
cd rulebased-content-filter
```

---

###  2. Run Backend

```
cd backend
npm install
node server.js
```

Backend runs on:

```
http://localhost:5000
```

---

###  3. Run Frontend

Open another terminal:

```
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

##  How the App Works

1. User creates rules (keyword, match type, action type)
2. Rules are stored in SQLite database
3. User inputs text
4. Backend processes text using rules
5. Frontend displays highlighted text or tooltips

---

##  API Endpoints

| Method | Endpoint                | Description     |
| ------ | ----------------------- | --------------- |
| GET    | /api/rules              | Get all rules   |
| POST   | /api/rules              | Create new rule |
| PUT    | /api/rules/:id          | Update rule     |
| DELETE | /api/rules/:id          | Delete rule     |
| POST   | /api/rules/process-text | Process text    |

---

##  Important Notes

* `rules.db` is automatically generated in the backend folder
* Make sure it is included in `.gitignore`
* Node.js must be installed before running the project

---

##  Submission Includes

* Source code (GitHub repository)
* Working full-stack application
* README with setup instructions

---

##  Author

Developed as part of a web development assignment.
