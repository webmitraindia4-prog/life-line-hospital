import API from "./api";

export const addAvailability = (data) => {
    return API.post("/doctor/availability", data);
};

export const getAvailability = () => {
    return API.get("/doctor/availability");
};

export const getAvailableDates = (doctorId) => {
    return API.get(`/availability/dates/${doctorId}`);
};

export const getAvailableSlots = (doctorId, date) => {
    const encodedDate = encodeURIComponent(String(date).slice(0, 10));
    return API.get(`/availability/slots/${doctorId}/${encodedDate}`);
};