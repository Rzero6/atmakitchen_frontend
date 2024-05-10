import axios from "axios";
export const BASE_URL = "http://127.0.0.1:8000";
export const getImageProduk = (thumbnail) => {
  return `${BASE_URL}/storage/produk/${thumbnail}`;
};
export const getImageHampers = (thumbnail) => {
  return `${BASE_URL}/storage/hampers/${thumbnail}`;
};
export const getProfilPic = (pic) => {
  return `${BASE_URL}/storage/customer/${pic}`;
};
const useAxios = axios.create({
  baseURL: `${BASE_URL}/api`,
});
export default useAxios;
