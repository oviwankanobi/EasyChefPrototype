import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const instance = axios.create({});

const refreshAuthLogic = (failedRequest) =>
  axios
    .post("http://127.0.0.1:8000/accounts/login/refresh/")
    .then((tokenRefreshResponse) => {
      localStorage.setItem("access_token", tokenRefreshResponse.data.token);
      failedRequest.response.config.headers["Authorization"] =
        "Bearer " + tokenRefreshResponse.data.token;
      return Promise.resolve();
    });

createAuthRefreshInterceptor(instance, refreshAuthLogic);

function getAccessToken() {
  return localStorage.getItem("access_token");
}

instance.interceptors.request.use((request) => {
  request.headers["Authorization"] = `Bearer ${getAccessToken()}`;
  return request;
});

export { instance as axios };
