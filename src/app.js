const express = require('express');
const cors = require('cors');
const app = express();

// Add CORS configuration - PUT THIS BEFORE OTHER MIDDLEWARE
app.use(cors({
  origin: [
    'https://ticket-booking-modex-assignment-fro.vercel.app',
    'https://ticket-booking-modex-assignment-fro-git-193bcb-prejans-projects.vercel.app',
    'http://localhost:5173', // for local development
    'http://localhost:3000'  // for local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Your other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your routes
// ... rest of your code
