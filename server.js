import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import { connectDb } from './src/config/dbConfig.js';
import rootRouter from './src/routes/index.js';
import { fileURLToPath } from 'url';
import globalErrorHandler from './src/middlewares/globalError.js'
import path from 'path';

dotenv.config();

const app = express();
connectDb();

app.set('port', process.env.PORT || 5050);

const PORT = app.get('port');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(morgan('dev'));
// app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Routers
// app.use('/', rootRouter);
// Test route
app.get('/', (req, res) => {
  res.send('API is running 🚀');
});

// Global Custom-ErrorHandler
// app.use(globalErrorHandler);

// Once The MongoDb is On We start the server..
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDb :D');
    app.listen(PORT, () => {
        const servStatus = `Server Started at PORT http://localhost:${PORT} 😁`
        console.log(servStatus);
    });
});