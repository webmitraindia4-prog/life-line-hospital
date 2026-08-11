const db = require("../config/db");
const { sendWhatsApp } = require("../services/whatsappService");

// ================================
// Book Appointment
// ================================
exports.bookAppointment = async (req, res) => {
    try {

        const {
            patient_id,
            doctor_id,
            appointment_date,
            appointment_time
        } = req.body;

        if (
            !patient_id ||
            !doctor_id ||
            !appointment_date ||
            !appointment_time
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Check duplicate booking
        const [existing] = await db.query(
            `SELECT id
             FROM appointments
             WHERE doctor_id = ?
             AND appointment_date = ?
             AND appointment_time = ?
             AND status IN ('Pending','Confirmed')`,
            [
                doctor_id,
                appointment_date,
                appointment_time
            ]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: "This slot is already booked."
            });
        }

        // Verify doctor availability for requested date and time
        const [availabilityRows] = await db.query(
            `SELECT start_time, end_time, slot_duration
             FROM doctor_availability
             WHERE doctor_id = ?
             AND available_date = ?`,
            [doctor_id, appointment_date]
        );

        if (availabilityRows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Doctor has no availability on the selected date."
            });
        }

        const availability = availabilityRows[0];
        const startDateTime = new Date(`${appointment_date}T${availability.start_time}`);
        const endDateTime = new Date(`${appointment_date}T${availability.end_time}`);
        const durationMinutes = Number(availability.slot_duration);
        const availableSlots = [];
        let slotTime = new Date(startDateTime);

        while (slotTime < endDateTime) {
            availableSlots.push(slotTime.toTimeString().substring(0, 5));
            slotTime = new Date(slotTime.getTime() + durationMinutes * 60000);
        }

        if (!availableSlots.includes(appointment_time)) {
            return res.status(400).json({
                success: false,
                message: "Selected time is not available for this doctor on the chosen date."
            });
        }

        // Insert Appointment
        const [result] = await db.query(
            `INSERT INTO appointments
            (
                patient_id,
                doctor_id,
                appointment_date,
                appointment_time,
                status
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                patient_id,
                doctor_id,
                appointment_date,
                appointment_time,
                "Pending"
            ]
        );

        // Get Doctor Details
        const [doctor] = await db.query(
            `SELECT full_name, phone
             FROM doctors
             WHERE id = ?`,
            [doctor_id]
        );

        // Get Patient Details
        const [patient] = await db.query(
            `SELECT full_name, phone
             FROM patients
             WHERE id = ?`,
            [patient_id]
        );

        // Send WhatsApp (only if doctor phone exists)
        if (
            doctor.length > 0 &&
            doctor[0].phone
        ) {

            const message =
`🏥 Lifeline Super Speciality Hospital

New Appointment Booked

Patient: ${patient[0].full_name}
Phone: ${patient[0].phone}

Doctor: ${doctor[0].full_name}

Date: ${appointment_date}
Time: ${appointment_time}

Please login to Hospital Dashboard.`;

            await sendWhatsApp(
                doctor[0].phone,
                message
            );
        }

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully.",
            appointment_id: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// ================================
// Get Available Slots
// ================================
exports.getAvailableSlots = async (req, res) => {

    try {

        const { doctorId, date } = req.params;

        const [availability] = await db.query(
            `SELECT
                start_time,
                end_time,
                slot_duration
            FROM doctor_availability
            WHERE doctor_id = ?
            AND available_date = ?`,
            [doctorId, date]
        );

        if (availability.length === 0) {
            return res.json({
                success: true,
                slots: []
            });
        }

        const {
            start_time,
            end_time,
            slot_duration
        } = availability[0];

        const [booked] = await db.query(
            `SELECT appointment_time
             FROM appointments
             WHERE doctor_id = ?
             AND appointment_date = ?
             AND status IN ('Pending','Confirmed')`,
            [doctorId, date]
        );

        const bookedSlots = booked.map(slot =>
            slot.appointment_time.toString().substring(0,5)
        );

        const slots = [];

        let current = new Date(`1970-01-01T${start_time}`);
        let end = new Date(`1970-01-01T${end_time}`);

        while(current < end){

            const time = current.toTimeString().substring(0,5);

            if(!bookedSlots.includes(time)){
                slots.push(time);
            }

            current.setMinutes(
                current.getMinutes() + slot_duration
            );

        }

        res.json({
            success:true,
            slots
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};

// ================================
// Doctor Appointments
// ================================
exports.getDoctorAppointments = async (req,res)=>{

    try{

        const doctorId=req.doctor.id;

        const [appointments]=await db.query(
            `SELECT
                a.id,
                p.full_name,
                p.phone,
                a.appointment_date,
                a.appointment_time,
                a.status
             FROM appointments a
             JOIN patients p
             ON a.patient_id=p.id
             WHERE a.doctor_id=?
             ORDER BY a.appointment_date,a.appointment_time`,
             [doctorId]
        );

        res.json({
            success:true,
            appointments
        });

    }catch(error){

        console.error(error);

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};

// ================================
// Update Appointment Status
// ================================
exports.updateAppointmentStatus = async (req,res)=>{

    try{

        const {id}=req.params;
        const {status}=req.body;

        const allowedStatus=[
            "Pending",
            "Confirmed",
            "Completed",
            "Cancelled"
        ];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                success:false,
                message:"Invalid status."
            });
        }

        await db.query(
            `UPDATE appointments
             SET status=?
             WHERE id=?`,
            [status,id]
        );

        res.json({
            success:true,
            message:"Appointment updated successfully."
        });

    }catch(error){

        console.error(error);

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};