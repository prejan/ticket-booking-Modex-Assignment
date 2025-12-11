const pool = require('../db');
const bookingService = require('../services/bookingService');

exports.createBooking = async (req, res) => {
  const { show_id, seats } = req.body;
  if (!show_id || !seats || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: 'show_id and seats[] required' });
  }

  try {
    const booking = await bookingService.createBooking(show_id, seats);
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    if (err.code === 'SEAT_TAKEN') {
      return res.status(409).json({ message: 'One or more seats already booked' });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.getBooking = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM bookings WHERE id=$1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Booking not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
