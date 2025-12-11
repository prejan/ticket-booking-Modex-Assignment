const pool = require('../db');

/**
 * Create a show and its seats
 * Body: { name, start_time, total_seats }
 */
exports.createShow = async (req, res) => {
  const { name, start_time, total_seats } = req.body;
  if (!name || !start_time || !total_seats) {
    return res.status(400).json({ message: 'name, start_time, total_seats required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const showRes = await client.query(
      `INSERT INTO shows (name, start_time, total_seats)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, start_time, total_seats]
    );
    const show = showRes.rows[0];

    const insertSeatText = `INSERT INTO seats (show_id, seat_number) VALUES ($1, $2)`;
    for (let i = 1; i <= total_seats; i++) {
      await client.query(insertSeatText, [show.id, i]);
    }

    await client.query('COMMIT');
    res.status(201).json(show);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

exports.listShows = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM shows ORDER BY start_time ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getShowWithSeats = async (req, res) => {
  const showId = req.params.id;
  try {
    const showRes = await pool.query('SELECT * FROM shows WHERE id=$1', [showId]);
    if (showRes.rowCount === 0) return res.status(404).json({ message: 'Show not found' });

    const seatsRes = await pool.query('SELECT seat_number, is_booked FROM seats WHERE show_id=$1 ORDER BY seat_number', [showId]);
    res.json({ ...showRes.rows[0], seats: seatsRes.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
