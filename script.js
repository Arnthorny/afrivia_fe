"use strict";

// const ENDPOINT_URL = "http://127.0.0.1:8000/api/v1";
const ENDPOINT_URL = "https://api.afrivia.me/api/v1";
const BEARER_EXPIRY_MINUTES = 15;
const REFRESH_EXPIRY_DAYS = 15;

let auth_routes_instance, with_cred_instance, unauth_instance;
let getCookie, setAuthCookies, deleteCookie;

const getCookieHere = function (name) {
  let value = `; ${document.cookie}`;
  let parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

window.addEventListener("load", function (e) {
  const signInButton = document.getElementById("profile_sign");

  const username = getCookieHere("username");
  if (username !== undefined) {
    const anchor = signInButton.querySelector("a");

    anchor.textContent = username;
    anchor.href = "./dashboard.html";
  } else {
    const anchor = signInButton.querySelector("a");

    anchor.textContent = "Sign In";
    anchor.href = "./login.html";
  }
});
