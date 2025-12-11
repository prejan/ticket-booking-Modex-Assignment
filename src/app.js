const express = require('express');
const cors = require('cors');
const showsRouter = require('./routes/shows');
const bookingsRouter = require('./routes/bookings');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/shows', showsRouter);
app.use('/api/bookings', bookingsRouter);

app.get('/', (req, res) => res.json({ status: 'ok', message: 'Ticket Booking Backend' }));

module.exports = app;
