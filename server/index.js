const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db')
const { registerRoute, verifyRoute, loginRoute} = require('./routes/auth')


// initializations
const app = express();
const port = process.env.port || 8500;

// database connections
connectDB();

// middleware
app.use(express.json());

// routes
app.use('/server/auth', registerRoute);
app.use('/server/auth', verifyRoute);
app.use('/server/auth', loginRoute)

//port
app.listen(port, () => {
  console.log (`server is running on port ${port}`);
})