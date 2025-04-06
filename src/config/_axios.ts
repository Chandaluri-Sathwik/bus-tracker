import Axios from "axios";
const baseURL = `http://localhost:4000/driver`;
// const baseURL = `https://api.esummitiitm.org/points/`;

const instance = Axios.create({
	baseURL,
	withCredentials: true,
});
export default instance;
