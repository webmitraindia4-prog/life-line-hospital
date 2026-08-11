import API from "./api";

export const getSummaryReport = async () => {
  try {
    const response = await API.get("/reports/summary");

    return {
      success: true,
      report: response.data.report || {},
    };
  } catch (error) {
    console.error("Get Summary Report Error:", error);

    return {
      success: false,
      report: {},
      message: error?.response?.data?.message || error.message || "Unable to load report.",
    };
  }
};

export const getTodayReport = async () => {
  try {
    const response = await API.get("/reports/today");

    return {
      success: true,
      appointments: response.data.appointments || [],
    };
  } catch (error) {
    console.error("Get Today Report Error:", error);

    return {
      success: false,
      appointments: [],
      message: error?.response?.data?.message || error.message || "Unable to load today report.",
    };
  }
};
