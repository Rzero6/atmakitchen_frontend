import axios from "axios";
export const BASE_URL = "http://127.0.0.1:8000";
// export const getImageMobil = (thumbnail) => {
//   return `${BASE_URL}/storage/mobil/${thumbnail}`;
// };
// export const getProfilPic = (thumbnail) => {
//   return `${BASE_URL}/storage/user/${thumbnail}`;
// };
const useAxios = axios.create({
  baseURL: `${BASE_URL}/api`,
});
export default useAxios;
