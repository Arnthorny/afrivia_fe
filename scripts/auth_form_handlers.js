"use strict";
import { setAuthCookies } from "./auth_handlers.js";

function errorRequestHandler(errData, statusCode = 500) {
  // console.log(errData.errors);
  switch (statusCode) {
    case 422:
      alert(`There is an error with ${errData.errors[0].loc[1]}`);
      break;

    case 400:
      alert(`${errData.message}`);
      break;

    default:
      alert("An unknown error occured");
      break;
  }
}
async function signInSubmissionHandler(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const formObjectData = Object.fromEntries(Array.from(formData.entries()));

  let postLoginOptions = {
    method: "post",
    url: "/auth/login",
    withCredentials: true,
    data: formObjectData,
  };

  try {
    const response = await unauth_instance(postLoginOptions);
    if (response.status == 200) {
      setAuthCookies(response.data);
      window.location.href = "./dashboard.html";
    }
  } catch (error) {
    console.error(error.response);
  }
}

async function signUpSubmissionHandler(e) {
  e.preventDefault();
  const form = e.target;

  const formData = new FormData(form);
  const formObjectData = Object.fromEntries(Array.from(formData.entries()));
  let tmp = String(formObjectData["country_preferences"]).split(", ");

  formObjectData["country_preferences"] = tmp[0] === "" ? [] : tmp;

  let postLoginOptions = {
    method: "post",
    url: "/auth/register",
    withCredentials: true,
    data: formObjectData,
  };

  try {
    const response = await unauth_instance(postLoginOptions);
    if (response.status == 201) {
      setAuthCookies(response.data);
      window.location.href = "./dashboard.html";
    }
  } catch (error) {
    errorRequestHandler(error.response.data, error.response.status);
    console.log(error.response);
  }
}

export { signInSubmissionHandler, signUpSubmissionHandler };
