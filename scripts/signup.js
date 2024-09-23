import { signUpSubmissionHandler } from "./auth_form_handlers.js";

const signUpForm = document.getElementById("signup-form");
const passwordElem = document.querySelector("#signup-password");
const confirmPasswordElem = document.querySelector("#signup-confirm-password");

function validatePasswords() {
  if (passwordElem.value !== confirmPasswordElem.value) {
    confirmPasswordElem.setCustomValidity("Passwords Don't Match");
  } else confirmPasswordElem.setCustomValidity("");
}

signUpForm.addEventListener("submit", signUpSubmissionHandler);
passwordElem.addEventListener("input", validatePasswords);
confirmPasswordElem.addEventListener("input", validatePasswords);
