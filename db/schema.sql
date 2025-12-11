-- Shows table
CREATE TABLE IF NOT EXISTS shows (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  start_time TIMESTAMP NOT NULL,
  total_seats INT NOT NULL
);

-- Seats table (one row per seat)
CREATE TABLE IF NOT EXISTS seats (
  id SERIAL PRIMARY KEY,
  show_id INT NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  seat_number INT NOT NULL,
  is_booked BOOLEAN DEFAULT FALSE,
  UNIQUE (show_id, seat_number)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  show_id INT REFERENCES shows(id),
  seat_numbers INT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT NOW()
);
