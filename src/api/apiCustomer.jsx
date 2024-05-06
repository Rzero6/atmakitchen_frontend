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

export const GetCustomerById = async (id) => {
  try {
    const response = await useAxios.get(`/customer/${id}`, {
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

export const UpdateCustomerProfilPic = async (values) => {
  try {
    const response = await useAxios.put(`/customer/update/profil-pic/${values.id}`, values, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
