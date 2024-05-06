import useAxios from ".";
const SignIn = async (data) => {
  try {
    const response = await useAxios.post("/login", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const ResetPassword = async (data) => {
  try {
    const response = await useAxios.post("/password/reset", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const UpdatePassword = async (data) => {
  try {
    const response = await useAxios.put(`/password/update/${data.id}`, data, {
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

export { SignIn, ResetPassword, UpdatePassword };
