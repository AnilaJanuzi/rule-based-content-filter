
## Rule Based Content Filter

This project is a Rule-Based Content Filter application built with **React (Vite + TypeScript)** and **Node.js (Express)**.

The app allows users to create dynamic rules and process text by applying highlights or tooltips based on defined conditions. It also includes advanced features like **rule priority handling** and **dark/light mode UI**.

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
*  Dark Mode / Light Mode toggle
*  Rule Priority system (higher priority overrides lower ones)

---

## Advanced Functionality

### Rule Priority

Each rule has a **priority value**.

* Higher number = higher priority
* When multiple rules match the same keyword:
  * The rule with the **highest priority is applied**
  
Example:

| Keyword | Color | Priority |
|--------|------|---------|
| test   | red  | 10      |
| test   | blue | 1       |

➡ Result: `test` will be **red**

---

### Smart Rule Handling

* Supports multiple rules for the same keyword
* Ensures consistent output using priority logic
* Prevents conflicts between overlapping rules

---

### Dark / Light Mode

The application supports both themes:

*  Dark Mode (default modern UI)
*  Light Mode (original clean layout)

Features:
* Smooth toggle between modes
* UI colors adapt automatically
* Rule highlight colors remain unchanged for consistency



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
│   ├── assets/
│   │   └── icons/
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
git clone https://github.com/AnilaJanuzi/rule-based-content-filter.git
cd rule-based-content-filter
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
