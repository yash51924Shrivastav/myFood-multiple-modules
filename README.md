# Restaurant App (Swiggy Clone)

A modern, responsive restaurant management application built with the MERN stack (MongoDB, Express, React, Node.js). This project features a customer-facing interface for browsing restaurants and menus, a cart system with real-time totals, and a backend that supports both MongoDB and local JSON persistence.

## 🚀 Features

- **Multi-Module Architecture**:
  - **Customer Module**: Browse restaurants, view detailed menus, and manage cart items.
  - **Admin Module**: Conceptual interface for restaurant management.
- **Dynamic Menu & Cart**:
  - Add/Remove items with quantity controls (+/- buttons).
  - Real-time total calculation.
  - Persistent cart state using LocalStorage.
- **Dual Database Support**:
  - **MongoDB**: Connects to a MongoDB database if a `MONGO_URI` is provided.
  - **JSON Fallback**: Automatically falls back to a local `data.json` file if MongoDB is not connected, ensuring the app always runs.
- **Responsive Design**: Fully responsive UI built with Tailwind CSS, optimized for mobile and desktop.
- **Production Ready**: Includes scripts to build the React frontend and serve it via the Express backend.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router DOM
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose) or Local JSON (lowdb-style)
- **State Management**: React Context API (CartContext)

## 📦 Installation

1.  **Clone the repository** (if applicable) or navigate to the project folder.
2.  **Install dependencies**:
    ```bash
    npm install
    ```

## 🏃‍♂️ Running the Project

### Development Mode
To run the frontend and backend separately for development:

1.  Start the Backend Server (runs on port 8080):
    ```bash
    npm run server
    ```
2.  Start the Frontend (Vite):
    ```bash
    npm run dev
    ```

### Production Mode
To build the frontend and serve the complete application using the Express backend:

```bash
npm run prod
```
This command will:
1.  Build the React app to the `dist/` folder.
2.  Start the Express server, which serves the static files and handles API requests.
3.  The app will be accessible at `http://localhost:8080`.

## 📂 Project Structure

- **`src/`**: React frontend source code.
  - **`features/`**: Feature-based modules (Menu, Cart, Restaurants, Admin).
  - **`shared/`**: Reusable components (UI, API clients) and Contexts (CartContext).
- **`server/`**: Node.js/Express backend.
  - **`index.cjs`**: Main server entry point, handles API routes and static file serving.
  - **`data.json`**: Local fallback database file.
- **`dist/`**: Production build output (generated after `npm run build`).

## ⚙️ Configuration

The application is designed to work out-of-the-box. However, you can configure the database connection:

- **MongoDB**: Set the `MONGO_URI` environment variable in a `.env` file or your system environment to connect to a MongoDB instance.
  - Example: `MONGO_URI=mongodb://localhost:27017/restaurant-app`
- **Port**: The server defaults to port `8080`. You can override this with the `PORT` environment variable.

## 📝 API Endpoints

- **`GET /api/restaurants`**: Fetch list of restaurants.
- **`GET /api/restaurants/:id`**: Fetch specific restaurant details.
- **`GET /api/menu`**: Fetch menu items.
- **`POST /api/orders`**: Place an order (conceptual).
- **`POST /api/admin/menu`**: Add new menu items (Admin).
