import { submissionFormSubmissionHandler } from "./auth_form_handlers.js";
import { retrieveRenderCategoriesOrCountries } from "./submission_api_config_helpers.js";

const submissionForm = document.querySelector(
  ".submission-form-container > form"
);
const categories_select = document.getElementById("category");

submissionForm.addEventListener("submit", submissionFormSubmissionHandler);
retrieveRenderCategoriesOrCountries(categories_select, "categories");
