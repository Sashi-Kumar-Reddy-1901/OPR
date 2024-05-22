import axios from "axios";

export default axios.create({
  baseURL: 'https://sit1opr4.finakon.in/api',
  //  baseURL: "https://sit1opr5.finakon.in/api",
  // baseURL : 'http://162.255.87.101:8081/api'
});