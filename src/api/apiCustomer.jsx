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

export const UpdateCustomerProfilPic = async (values, id) => {
  try {
    const response = await useAxios.post(
      `/customer/update/profil-pic/${id}`,
      values,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const UpdateCustomer = async (values) => {
  try {
    const response = await useAxios.put(`/profile/${values.id}`, values, {
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
