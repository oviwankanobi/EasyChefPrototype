import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const instance = axios.create({});

const refreshAuthLogic = (failedRequest) =>
  axios
    .post("http://127.0.0.1:8000/accounts/login/refresh")
    .then((tokenRefreshResponse) => {
      localStorage.setItem("refresh_token", tokenRefreshResponse.data.token);
      failedRequest.response.config.headers["Authorization"] =
        "Bearer " + tokenRefreshResponse.data.token;
      return Promise.resolve();
    });

createAuthRefreshInterceptor(instance, refreshAuthLogic);

export { instance as axios };
