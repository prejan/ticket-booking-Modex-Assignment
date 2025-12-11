const pool = require('../db');

/**
 * createBooking: attempts to book seats atomically using transaction + FOR UPDATE.
 * Returns booking row when successful.
 * Throws {code:'SEAT_TAKEN'} if any seat already booked.
 */
exports.createBooking = async (showId, seatNumbers) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Lock the seat rows for update
    const lockRes = await client.query(
      `SELECT id, seat_number, is_booked 
       FROM seats
       WHERE show_id = $1 AND seat_number = ANY($2)
       FOR UPDATE`,
      [showId, seatNumbers]
    );

    // If some seats are missing or already booked, reject.
    const lockedSeats = lockRes.rows;
    if (lockedSeats.length !== seatNumbers.length) {
      await client.query('ROLLBACK');
      const err = new Error('One or more seats do not exist');
      err.code = 'SEAT_TAKEN';
      throw err;
    }

    const anyBooked = lockedSeats.some(s => s.is_booked);
    if (anyBooked) {
      await client.query('ROLLBACK');
      const err = new Error('Seat already booked');
      err.code = 'SEAT_TAKEN';
      throw err;
    }

    // mark seats as booked
    await client.query(
      `UPDATE seats SET is_booked = true
       WHERE show_id = $1 AND seat_number = ANY($2)`,
      [showId, seatNumbers]
    );

    // create booking row (CONFIRMED)
    const bookingRes = await client.query(
      `INSERT INTO bookings (show_id, seat_numbers, status)
       VALUES ($1, $2, 'CONFIRMED') RETURNING *`,
      [showId, seatNumbers]
    );

    await client.query('COMMIT');
    return bookingRes.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};
