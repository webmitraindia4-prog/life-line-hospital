import API from "./api";

export const registerPatient = (data) => {
    return API.post("/patients/register", data);
};