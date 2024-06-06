import useAxios from ".";

export const GetAllTransaksi = async () => {
  try {
    const response = await useAxios.get("/transaksi", {
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
export const CreateTransaksi = async (data) => {
  try {
    const response = await useAxios.post("/transaksi", data, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const CreateDetailTransaksi = async (data) => {
  try {
    const response = await useAxios.post("/transaksi/detail", data, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const GetTransaksiById = async (id) => {
  try {
    const response = await useAxios.get(`/transaksi/${id}`, {
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

export const GetTransaksiByUserId = async (id) => {
  try {
    const response = await useAxios.get(`customer/${id}/transaksi`, {
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

export const UpdateTransaksi = async (values) => {
  try {
    const response = await useAxios.put(`/transaksi/${values.id}`, values, {
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

export const UploadBuktiBayarTransaksi = async (values, id) => {
  try {
    const response = await useAxios.post(`/transaksi/${id}`, values, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
