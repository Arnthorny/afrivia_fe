import { submissionFormSubmissionHandler } from "./auth_form_handlers.js";

const submissionForm = document.querySelector(
  ".submission-form-container > form"
);
const categories_select = document.getElementById("category");

function renderCategories(l_categories) {
  let content = l_categories
    .map((val) => `<option value="${val}">${val.replace(/-/g, " ")}</option>`)
    .join("");

  categories_select.insertAdjacentHTML("beforeend", content);
}

async function retrieveCategories() {
  let retrieveCategoriesOptions = {
    method: "get",
    url: "/submissions/categories",
  };
  try {
    const response = await unauth_instance(retrieveCategoriesOptions);
    if (response.status == 200) {
      renderCategories(response.data.data);
    }
  } catch (error) {
    alert("Could not retrieve categories");
    console.log(error && error.response);
  }
}

submissionForm.addEventListener("submit", submissionFormSubmissionHandler);
retrieveCategories();
