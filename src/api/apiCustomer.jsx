import useAxios from ".";

export const GetAllCustomer = async () => {
  try {
    const response = await useAxios.get("/customer", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response.data;
  }
};
