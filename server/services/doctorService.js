import API from "./api";

export const getDoctors = () => {
    return API.get("/doctor");
};

export const getDoctorAvailability = (doctorId, date) => {
    return API.get(`/appointments/slots/${doctorId}/${date}`);
};

export const bookAppointment = (data) => {
    return API.post("/appointments/book", data);
};