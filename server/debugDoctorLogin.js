const db = require('./config/db');
const bcrypt = require('bcryptjs');
const axios = require('axios');

async function main() {
  try {
    const email = 'sukh.sagar@lifelinehospital.in';
    const password = 'Doctor@2026';

    const [rows] = await db.query('SELECT id, full_name, email, password, status FROM doctors WHERE email = ?', [email]);
    console.log('doctor rows:', JSON.stringify(rows, null, 2));

    if (rows.length === 0) {
      console.log('Doctor not found in DB.');
      return;
    }

    const doctor = rows[0];
    const match = await bcrypt.compare(password, doctor.password);
    console.log('bcrypt compare result:', match);

    try {
      const response = await axios.post('http://localhost:5002/api/auth/doctor/login', {
        email,
        password,
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
      });
      console.log('login response:', response.data);
    } catch (err) {
      if (err.response) {
        console.log('login response error status:', err.response.status);
        console.log('login response error data:', err.response.data);
      } else {
        console.error('login request error:', err.message);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

main();