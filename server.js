const express  = require('express');

const cors =  require('cors');

const dotenv = require('dotenv');

var cookieParser = require('cookie-parser');

const connectDB = require('./config/dbConnection');
const app = express();

dotenv.config();


app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin: "*",
    credentials: true,
}));

connectDB();

// Routes 
app.use('/api/v1/', require('./routes/userRoutes'))

const port = process.env.PORT ||  8080;

app.listen(port, () => console.log(`Server is running on port ${port}`));