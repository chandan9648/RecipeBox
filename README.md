📦RecipeBox – Recipe Management System

A modern full-stack web application that allows users to create, manage, and explore recipes.
Users can add ingredients, edit recipes, and organize their cooking ideas in one place.

🚀 Features
🍲 Add new recipes
📝 Edit existing recipes
❌ Delete recipes
📋 View recipe details (ingredients & instructions)
👨‍🍳 Admin approvement and rejection of recipes
💾 Data persistence (Database / Local Storage)
📱 Responsive UI (Mobile + Desktop)

🛠️ Tech Stack
Frontend
React.js
Tailwind CSS / CSS
Axios

Backend
Node.js
Express.js

Database
MongoDB

📂 Project Structure
RecipeBox/
----------------------------
backend/
│
├── src/
│   ├── controllers/        # Business logic (API handling)
│   │   ├── authController.js
│   │   └── recipeController.js
│   │
│   ├── db/                 # Database connection
│   │   └── db.js
│   │
│   ├── middlewares/        # Custom middlewares
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/             # MongoDB schemas
│   │   ├── User.js
│   │   └── Recipe.js
│   │
│   ├── routes/             # API routes
│   │   ├── authRoutes.js
│   │   └── recipeRoutes.js
│   │
│   ├── utils/              # Helper functions
│   │   └── generateToken.js
│   │
│   └── app.js              # Express app config
│
├── server.js               # Entry point (start server)
├── .env.example            # Environment variables template
├── .gitignore
├── package.json
└── package-lock.json
------------------------------
frontend/
│
├── public/                 # Static assets
│
├── src/
│   ├── Components/        # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── RecipeCard.jsx
│   │   └── AdminLogo.jsx
│   │
│   ├── context/           # Global state (Context API)
│   │   └── AuthContext.jsx
│   │
│   ├── pages/             # Application pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── AddRecipe.jsx
│   │   ├── EditRecipe.jsx
│   │   └── RecipeDetails.jsx
│   │
│   ├── routes/            # Route handling
│   │   └── AppRoutes.jsx
│   │
│   ├── utils/             # Helper functions
│   │   └── api.js
│   │
│   ├── App.jsx            # Main component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
│
├── index.html
├── .env.example
├── .gitignore
├── eslint.config.js
├── package.json
└── package-lock.json

⚙️ Installation & Setup (Step-by-Step)
1️⃣ Clone the Repository
git clone https://github.com/chandan9648/RecipeBox.git

cd RecipeBox
2️⃣ Install Dependencies
For Backend
cd backend
npm install
For Frontend
cd frontend
npm install
3️⃣ Setup Environment Variables

Create a .env file in the server folder:

PORT=3000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
ADMIN_SECRET=your_admin_secret_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
EMAIL_USER=your_email_address_here
EMAIL_PASS=your_email_app_password_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

4️⃣ Run the Application
Start Backend
cd backend
npm run dev

Start Frontend
cd frontend
npm start

5️⃣ Open in Browser
http://localhost:3000

🔄 How It Works
User opens the app
Adds a recipe (name + ingredients + instructions)
Data is stored in MongoDB
Recipes are displayed dynamically
User can update or delete anytime


📡 API Endpoints (Example)
Method	Endpoint	Description
GET	/recipes	Get all recipes
POST	/recipes	Add new recipe
PUT	/recipes/:id	Update recipe
DELETE	/recipes/:id	Delete recipe

🔐 Future Improvements
🔑 User Authentication (JWT)
👨‍🍳 Admin Authentication( approve/reject recipe)
❤️ Favorite recipes
🔍 Search & filter recipes
🌐 Deploy on cloud (vercel/ Render)

📊 Recipe analytics
🤝 Contributing
Fork the repo
Create a new branch
Commit your changes
Push and create PR
📜 License

This project is licensed under the MIT License.

👨‍💻 Author
Chandan Chaudhary

GitHub: https://github.com/chandan9648
