import { signInSubmissionHandler } from "./auth_form_handlers.js";

const signInForm = document.getElementById("signin-form");

signInForm.addEventListener("submit", signInSubmissionHandler);
