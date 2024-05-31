import useAxios from ".";
export const GetAllAlamat = async () => {
  try {
    const response = await useAxios.get("/alamat", {
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
