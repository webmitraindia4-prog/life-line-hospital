import API from "./api";

export const getMedicines = async () => {
  try {
    const response = await API.get("/pharmacy/medicine");

    return {
      success: true,
      medicines: response.data.medicines || [],
    };
  } catch (error) {
    console.error("Get Medicines Error:", error);

    return {
      success: false,
      medicines: [],
      message: error?.response?.data?.message || error.message || "Unable to load medicines.",
    };
  }
};

export const createMedicine = async (medicine) => {
  try {
    const response = await API.post("/pharmacy/medicine", medicine);

    return response.data;
  } catch (error) {
    console.error("Create Medicine Error:", error);

    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Unable to add medicine.",
    };
  }
};

export const updateMedicine = async (id, medicine) => {
  try {
    const response = await API.put(`/pharmacy/medicine/${id}`, medicine);

    return response.data;
  } catch (error) {
    console.error("Update Medicine Error:", error);

    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Unable to update medicine.",
    };
  }
};

export const dispenseMedicine = async (medicineSale) => {
  try {
    const response = await API.post("/pharmacy/dispense", medicineSale);

    return response.data;
  } catch (error) {
    console.error("Dispense Medicine Error:", error);

    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Unable to dispense medicine.",
    };
  }
};

export const getMedicineStock = async () => {
  try {
    const response = await API.get("/pharmacy/stock");

    return {
      success: true,
      medicines: response.data.medicines || [],
    };
  } catch (error) {
    console.error("Get Medicine Stock Error:", error);

    return {
      success: false,
      medicines: [],
      message: error?.response?.data?.message || error.message || "Unable to load stock.",
    };
  }
};

export const getLowStockMedicines = async () => {
  try {
    const response = await API.get("/pharmacy/low-stock");

    return {
      success: true,
      medicines: response.data.medicines || [],
    };
  } catch (error) {
    console.error("Get Low Stock Medicines Error:", error);

    return {
      success: false,
      medicines: [],
      message: error?.response?.data?.message || error.message || "Unable to load low stock medicines.",
    };
  }
};

export const deleteMedicine = async (id) => {
  try {
    const response = await API.delete(`/pharmacy/medicine/${id}`);

    return response.data;
  } catch (error) {
    console.error("Delete Medicine Error:", error);

    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Unable to delete medicine.",
    };
  }
};
