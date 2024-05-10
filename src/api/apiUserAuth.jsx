import useAxios from ".";
const SignIn = async (data) => {
  try {
    const response = await useAxios.post("/login", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
const SignUp = async (data) => {
  try {
    const response = await useAxios.post("/register", data);
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

const UpdatePassword = async (data, password) => {
  try {
    const response = await useAxios.put(
      `/password/update/${data.id}`,
      password,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export { SignIn, ResetPassword, UpdatePassword, SignUp };
