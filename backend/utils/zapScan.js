import axios from "axios";

export const zapScan = async (url) => {
  await axios.get(`http://localhost:8080/JSON/ascan/action/scan/?url=${url}`);
};
