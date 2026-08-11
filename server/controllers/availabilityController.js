const db = require("../config/db");

/*
==========================================
1. ADD AVAILABILITY
POST /api/doctor/availability
==========================================
*/
exports.addAvailability = async (req, res) => {
    try {

        const doctorId = req.doctor.id;

        const {
            available_date,
            start_time,
            end_time,
            slot_duration
        } = req.body;

        if (!available_date || !start_time || !end_time) {
            return res.status(400).json({
                success: false,
                message: "Available date, start time, and end time are required."
            });
        }

        const durationMinutes = Number(slot_duration) || 30;
        if (isNaN(durationMinutes) || durationMinutes <= 0) {
            return res.status(400).json({
                success: false,
                message: "Slot duration must be a positive number."
            });
        }

        console.log("Saving availability for doctor:", {
            doctorId,
            available_date,
            start_time,
            end_time,
            slot_duration: durationMinutes
        });

        const [result] = await db.query(
            `INSERT INTO doctor_availability
            (
                doctor_id,
                available_date,
                start_time,
                end_time,
                slot_duration
            )
            VALUES (?,?,?,?,?)`,
            [
                doctorId,
                available_date,
                start_time,
                end_time,
                durationMinutes
            ]
        );

        res.status(201).json({
            success: true,
            message: "Availability added successfully.",
            availability_id: result.insertId
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


/*
==========================================
2. GET MY AVAILABILITY
GET /api/doctor/availability
==========================================
*/

exports.getAvailability = async (req, res) => {

    try {

        const doctorId = req.doctor.id;

        const [rows] = await db.query(
            `SELECT *
             FROM doctor_availability
             WHERE doctor_id=?
             AND available_date >= CURDATE()
             ORDER BY available_date,start_time`,
            [doctorId]
        );

        res.json({

            success: true,

            availability: rows

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/*
==========================================
2.5 GET AVAILABLE DATES
GET /api/availability/dates/:doctorId
==========================================
*/
exports.getAvailableDates = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const [rows] = await db.query(
            `SELECT DISTINCT DATE_FORMAT(available_date, '%Y-%m-%d') AS available_date
             FROM doctor_availability
             WHERE doctor_id = ?
             AND available_date >= CURDATE()
             ORDER BY available_date ASC`,
            [doctorId]
        );

        res.json({
            success: true,
            dates: rows.map((row) => String(row.available_date).slice(0, 10))
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/*
==========================================
3. UPDATE AVAILABILITY
PUT /api/doctor/availability/:id
==========================================
*/

exports.updateAvailability = async (req, res) => {

    try {

        const doctorId = req.doctor.id;

        const availabilityId = req.params.id;

        const {

            available_date,
            start_time,
            end_time,
            slot_duration

        } = req.body;

        await db.query(

            `UPDATE doctor_availability

            SET

                available_date=?,
                start_time=?,
                end_time=?,
                slot_duration=?

            WHERE

                id=?
                AND doctor_id=?`,

            [

                available_date,
                start_time,
                end_time,
                slot_duration,
                availabilityId,
                doctorId

            ]

        );

        res.json({

            success: true,

            message: "Availability updated successfully."

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/*
==========================================
4. DELETE AVAILABILITY
DELETE /api/doctor/availability/:id
==========================================
*/

exports.deleteAvailability = async (req, res) => {

    try {

        const doctorId = req.doctor.id;

        const availabilityId = req.params.id;

        await db.query(

            `DELETE FROM doctor_availability

            WHERE

                id=?
                AND doctor_id=?`,

            [

                availabilityId,
                doctorId

            ]

        );

        res.json({

            success: true,

            message: "Availability deleted successfully."

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


/*
==========================================
5. GENERATE AVAILABLE SLOTS
GET /api/availability/slots/:doctorId/:date
==========================================
*/

exports.getAvailableSlots = async (req, res) => {

    try {

        const { doctorId, date } = req.params;
        const normalizedDate = String(date).slice(0, 10);

        console.log("Slot request for doctor", doctorId, "date", normalizedDate);

        const [availability] = await db.query(
            `SELECT start_time, end_time, slot_duration
             FROM doctor_availability
             WHERE doctor_id = ?
             AND available_date = ?`,
            [doctorId, normalizedDate]
        );

        if (availability.length === 0) {
            return res.json({
                success: true,
                slots: []
            });
        }

        const { start_time, end_time, slot_duration } = availability[0];
        const start = new Date(`${normalizedDate}T${start_time}`);
        let end = new Date(`${normalizedDate}T${end_time}`);
        const duration = Number(slot_duration);

        if (end <= start) {
            end = new Date(end.getTime() + 24 * 60 * 60000);
        }

        const slots = [];
        let current = new Date(start);

        while (current < end) {
            const time = current.toTimeString().substring(0, 5);
            slots.push(time);
            current = new Date(current.getTime() + duration * 60000);
        }

        const [booked] = await db.query(
            `SELECT appointment_time
             FROM appointments
             WHERE doctor_id = ?
             AND DATE(appointment_date) = ?
             AND status IN ('Pending','Confirmed')`,
            [doctorId, normalizedDate]
        );

        const bookedSlots = booked.map((a) =>
            a.appointment_time.toString().substring(0, 5)
        );

        const availableSlots = slots.filter((s) => !bookedSlots.includes(s));

        res.json({
            success: true,
            slots: availableSlots
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};