unauth_instance = axios.create({
  baseURL: ENDPOINT_URL,
});

with_cred_instance = axios.create({
  baseURL: ENDPOINT_URL,
  withCredentials: true,
});

auth_routes_instance = axios.create({
  baseURL: ENDPOINT_URL,
  withCredentials: true,
});

/* Returns given cookie value if available else undefined */
getCookie = function (name) {
  let value = `; ${document.cookie}`;
  let parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

setAuthCookies = async function (userObject) {
  document.cookie = `token=${
    userObject["access_token"]
  }; path=/; SameSite=Lax; max-age=${60 * BEARER_EXPIRY_MINUTES};`;

  if (userObject.data !== undefined) {
    document.cookie = `username=${
      userObject["data"]["username"]
    }; path=/; SameSite=Lax; max-age=${REFRESH_EXPIRY_DAYS * 24 * 60 * 60};`;

    document.cookie = `userId=${
      userObject["data"]["id"]
    }; path=/; SameSite=Lax; max-age=${REFRESH_EXPIRY_DAYS * 24 * 60 * 60};`;
  }
};

deleteCookie = function (name) {
  document.cookie = `${name}=; path=/; max-age=0;`;
};

// Add a request interceptor
auth_routes_instance.interceptors.request.use(
  function (config) {
    const token = getCookie("token");
    config.headers["Authorization"] = token ? `Bearer ${token}` : undefined;

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
auth_routes_instance.interceptors.response.use(
  (response) => response,
  async function (error) {
    const status = error.response ? error.response.status : null;
    const errMessage = error.response ? error.response.data["message"] : null;
    const originalRequest = error.config;
    if (status === 401) {
      try {
        const resToken = await with_cred_instance.post(
          "/auth/refresh-access-token"
        );
        if (resToken.statusText == "OK") {
          setAuthCookies(resToken.data);
          return auth_routes_instance(originalRequest);
        }
      } catch (err) {
        if (err.response.status === 401) {
          window.location.href = "./login.html";
        } else throw err;
      }
    } else {
      throw error;
    }
  }
);

// export { setAuthCookies };
