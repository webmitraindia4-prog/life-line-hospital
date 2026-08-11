require('dotenv').config();
const db = require('./config/db');

(async () => {
  try {
    const [doctors] = await db.query(
      'SELECT id, full_name, specialization, qualification, experience, profile_image, status FROM doctors ORDER BY id ASC'
    );
    console.log(JSON.stringify(doctors, null, 2));
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();
