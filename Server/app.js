import 'dotenv/config'; // Load environment variables from .env file
import express from 'express';
import cors from 'cors';
import {db} from './src/prisma/db.js'
import apiRoute from './routes/api.js'

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
  origin: 'http://localhost:5173',
  methods:['GET', 'POST', 'PUT', 'DELETE']
}))

const PORT = process.env.PORT || 3000;

const startServer = async() => {
  try{
    await db.connect({
      url:process.env.DATABASE_URL
    });
    console.log("postgresql connected");
    app.use('/api', apiRoute); // Use the API routes for any requests starting with /api
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
       });
  } catch(error) {
    console.error(error);
    process.exit(1);
  }
}

startServer();
