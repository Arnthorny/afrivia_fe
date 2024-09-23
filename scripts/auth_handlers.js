const ENDPOINT_URL = "http://localhost:8000/api/v1";

unauth_instance = axios.create({
  baseURL: ENDPOINT_URL,
});

with_cred_instance = axios.create({
  baseURL: ENDPOINT_URL,
  withCredentials: true,
});

auth_routes_instance = axios.create({
  baseURL: ENDPOINT_URL,
});

function getCookie(name) {
  let value = `; ${document.cookie}`;
  let parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

async function setAuthCookies(userObject) {
  document.cookie = `token=${
    userObject["access_token"]
  }; path=/; SameSite=Lax; max-age=${60 * 15};`;

  if (userObject.data !== undefined) {
    document.cookie = `username=${
      userObject["data"]["username"]
    }; path=/; SameSite=Lax; max-age=${60 * 15};`;

    document.cookie = `userId=${
      userObject["data"]["id"]
    }; path=/; SameSite=Lax; max-age=${60 * 15};`;
  }
}

async function deleteCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0;`;
}

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
        throw err;
      }
    } else {
      throw error;
    }
  }
);

export { setAuthCookies };
