# 📝 CLI Todo List

A simple and interactive Command Line Todo List application built with **Node.js** and the **Commander.js** package. Easily manage your tasks — add, edit, list, and delete — all from the terminal.

---

## 🚀 Features

- Add entries with a unique auto-incremented ID
- List all tasks or filter by status
- Edit tasks (title and/or status)
- Delete tasks by ID
- Status options: `to-do` (default), `in progress`, `done`

---

## 📦 Installation

```bash
git clone https://github.com/your-username/cli-todo-list.git
cd cli-todo-list
npm install
```

---


## 📂 Usage
## General Command Structure
```bash
node index.js <command> [options]
```

## Available Commands
#### ➕ Add a new entry
```bash
node index.js add -t "Your task title"
```
#### Options:
-t, --title (required): Title of the todo entry

---

#### 📋 List all entries
```bash
node index.js list
```
Optional: Filter by status
```bash
node index.js list -s "done"
```
#### Options:
-s, --status: Filter by to-do, in progress, or done

---

#### ✏️ Edit an entry
```bash
node index.js edit -i <id> -t "New title" -s "done"
```

#### Options:

-i, --id (required): ID of the entry to edit

-t, --title: New title

-s, --status: New status (to-do, in progress, or done)

Note: You must provide at least one of -t or -s

---

#### 🗑️ Delete an entry
```bash
node index.js delete <id>
```

---

## 💾 Data Storage
All tasks are stored in a todos.json file in the project directory.

---

## 🧩 Dependencies
commander – CLI interface handling

fs – Node.js File System for data persistence

---

## 📄 License
MIT

---

## ✨ Example Workflow
```bash
node index.js add -t "Finish project"
node index.js add -t "Study for exams"
node index.js list
node index.js edit -i 1 -s "done"
node index.js list -s "done"
node index.js delete 2
```
