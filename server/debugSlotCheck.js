const db = require('./config/db');

(async () => {
  try {
    const doctorId = 6;
    const date = '2026-08-10';
    const [rows] = await db.query(
      'SELECT id, doctor_id, available_date, DATE(available_date) AS available_date_only, start_time, end_time, slot_duration FROM doctor_availability WHERE doctor_id = ? ORDER BY id',
      [doctorId]
    );
    console.log('availability rows:', JSON.stringify(rows, null, 2));

    const [matchRows] = await db.query(
      'SELECT id, doctor_id, available_date, DATE(available_date) AS available_date_only FROM doctor_availability WHERE doctor_id = ? AND DATE(available_date) = ?',
      [doctorId, date]
    );
    console.log('matched rows for date:', JSON.stringify(matchRows, null, 2));

    const [booked] = await db.query(
      'SELECT appointment_time FROM appointments WHERE doctor_id = ? AND DATE(appointment_date) = ? AND status IN (\'Pending\', \'Confirmed\')',
      [doctorId, date]
    );
    console.log('booked slots:', JSON.stringify(booked, null, 2));

    if (rows.length > 0) {
      const availability = rows.find((row) => String(row.available_date_only) === date);
      console.log('availability for specific date:', availability);
      if (availability) {
        const start = new Date(`${date}T${availability.start_time}`);
        let end = new Date(`${date}T${availability.end_time}`);
        console.log('start:', start.toISOString(), 'end:', end.toISOString());
        if (end <= start) {
          end = new Date(end.getTime() + 24 * 60 * 60000);
          console.log('end adjusted:', end.toISOString());
        }
        const duration = Number(availability.slot_duration);
        const slots = [];
        let current = new Date(start);
        while (current < end) {
          slots.push(current.toTimeString().substring(0, 5));
          current = new Date(current.getTime() + duration * 60000);
          if (slots.length > 100) break;
        }
        console.log('generated slots:', slots.length, slots.slice(0, 20));
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
})();