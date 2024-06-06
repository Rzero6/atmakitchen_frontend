import useAxios from ".";

export const GetAllPresensi = async () => {
  try {
    const response = await useAxios.get("/presensi", {
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
