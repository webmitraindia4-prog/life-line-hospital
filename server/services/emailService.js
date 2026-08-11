const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Generic Email Function
const sendMail = async (to, subject, html) => {

    await transporter.sendMail({
        from: `"Lifeline Super Speciality Hospital" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });

};

// Appointment Email
const sendAppointmentEmail = async (appointment) => {

    const html = `
        <h2>New Appointment Booking</h2>

        <table border="1" cellpadding="8" cellspacing="0">
            <tr>
                <td><strong>Patient Name</strong></td>
                <td>${appointment.patient_name}</td>
            </tr>

            <tr>
                <td><strong>Mobile</strong></td>
                <td>${appointment.mobile}</td>
            </tr>

            <tr>
                <td><strong>Department</strong></td>
                <td>${appointment.department}</td>
            </tr>

            <tr>
                <td><strong>Doctor</strong></td>
                <td>${appointment.doctor_name}</td>
            </tr>

            <tr>
                <td><strong>Date</strong></td>
                <td>${appointment.date}</td>
            </tr>

            <tr>
                <td><strong>Time</strong></td>
                <td>${appointment.time}</td>
            </tr>

            <tr>
                <td><strong>Symptoms</strong></td>
                <td>${appointment.symptoms}</td>
            </tr>
        </table>
    `;

    await sendMail(
        process.env.EMAIL_USER,
        "New Appointment Booking",
        html
    );

};

module.exports = {
    sendMail,
    sendAppointmentEmail
};