const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route');
const cors = require('cors');


const app = express();
//middlewares
app.use(express.json());
// Configure CORS for dev front-end
app.use(cors({

	origin: ["https://recipeebox.vercel.app", "http://localhost:5173"],
	credentials: true
}));

app.use(cookieParser());

//Routes
app.use('/api/auth', authRoutes);



module.exports = app;
