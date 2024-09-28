"use strict";

// const ENDPOINT_URL = "http://127.0.0.1:8000/api/v1";
const ENDPOINT_URL = "https://api.afrivia.me/api/v1";
const BEARER_EXPIRY_MINUTES = 15;
const REFRESH_EXPIRY_DAYS = 15;

let auth_routes_instance,
  with_cred_instance,
  unauth_instance,
  auth_routes_with_cred_instance;
let getCookie, setAuthCookies, deleteCookie;

const getCookieHere = function (name) {
  let value = `; ${document.cookie}`;
  let parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

window.addEventListener("load", function (e) {
  const signInButton = document.getElementById("profile_sign");
  if (signInButton === null) return;

  const username = getCookieHere("username");
  if (username !== undefined) {
    const anchor = signInButton.querySelector("a");

    anchor.textContent = username;
    anchor.href = "./dashboard.html";
  } else {
    const anchor = signInButton.querySelector("a");

    anchor.textContent = "Mod Login";
    anchor.href = "./login.html";
  }
});

// JavaScript for hamburger menu functionality
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector("nav > ol");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

navLinks.querySelectorAll("li").forEach((n) =>
  n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
  })
);

async function spinner_active(activate, el) {
  const icon = `<i class="fas fa-cog fa-spin"></i>`;
  spinner_active.initHTML =
    el.innerHTML !== icon ? el.innerHTML : spinner_active.initHTML;

  while (el.firstChild) el.removeChild(el.firstChild);
  el.disabled = activate;

  if (activate) el.insertAdjacentHTML("beforeend", icon);
  else el.insertAdjacentHTML("beforeend", spinner_active.initHTML);
}
