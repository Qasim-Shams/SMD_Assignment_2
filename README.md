# TodoApp - React Native CLI with Stack Navigation

A modern Todo List application built with **React Native CLI** (`@react-native-community/cli`) featuring seamless forward and backward navigation.

---

## 🚀 Features

- **Back & Forward Navigation Flows**:
  - **Forward Navigation**:
    - From **TodoListScreen** forward to **AddTaskScreen** via the "+ Add Task" header button or the bottom navigation bar.
    - From **TodoListScreen** forward to **TaskDetailScreen** by tapping any task card or the "Details ➔" button.
    - From **AddTaskScreen** forward to **TaskDetailScreen** using the "Save & Forward to Details ➔" action.
    - Between tasks on **TaskDetailScreen** using **"Next Task ➔"** to navigate forward through your list.
  - **Backward Navigation**:
    - Standard native stack header back button (`← Back`).
    - Explicit in-app **"← Back to List"** buttons on all detail screens.
    - **"⬅ Previous Task"** button on **TaskDetailScreen** to navigate backwards through your tasks.
    - Discard and go back on task creation.
- **Task Management**:
  - Add tasks with title, description/notes, priority level (Low, Medium, High), and category tags (Work, Personal, Shopping, Health, Other).
  - Quick toggle checkbox for task completion.
  - Delete tasks with confirmation dialog.
  - Filter tasks by status: **All**, **Active**, and **Completed**.
  - Dynamic statistics summary (Total, Pending, Completed).
- **Persistent Context**:
  - Global state managed via `TodoContext` for state synchronization across all screens.
- **Full Type-Safety**:
  - Strict TypeScript definitions for navigation routes and todo data structures.

---

## 📂 Project Structure

```
TodoApp/
├── src/
│   ├── types/
│   │   └── todo.ts               # Todo item and navigation parameter types
│   ├── context/
│   │   └── TodoContext.tsx       # State management & adjacent task finder
│   └── screens/
│       ├── TodoListScreen.tsx    # Main todo list screen with stats & filters
│       ├── AddTaskScreen.tsx     # Create task screen with forward/back options
│       └── TaskDetailScreen.tsx  # Detailed view with prev/next task navigation
├── __tests__/
│   ├── App.test.tsx              # Root app render test
│   └── TodoNavigation.test.tsx   # Navigation & state unit tests
├── App.tsx                       # Root component with NavigationContainer
└── package.json
```

---

## 🛠️ How to Run the App

### 1. Start Metro Bundler
From the `TodoApp` directory:
```bash
cd "D:\expo cli\TodoApp"
npm start
```

### 2. Run on Android
Make sure an Android device is connected via USB with debugging enabled, or start an Android Emulator:
```bash
npm run android
```

### 3. Run Tests
```bash
npm test
```

### 4. Run TypeScript Check
```bash
npx tsc --noEmit
```
