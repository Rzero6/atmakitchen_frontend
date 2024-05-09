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
