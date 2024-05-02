import useAxios from ".";
const SignIn = async (data) => {
  try {
    const response = await useAxios.post("/admin/login", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export { SignIn };