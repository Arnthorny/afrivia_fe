import { retrieveRenderCategoriesOrCountries } from "./submission_api_config_helpers.js";

const api_form = document.getElementById("api-config-form");
const apiLinkDiv = document.getElementById("api-link");

const categories_select = document.getElementById("category");
const countries_select = document.getElementById("country");
const errorBox = document.getElementById("error-box");

function handleGenAPILink(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const formObjectData = Object.fromEntries(Array.from(formData.entries()));

  const baseUrl = new URL(`${ENDPOINT_URL}/questions`);

  Object.entries(formObjectData).forEach((arr) => {
    if (arr[1] != "") {
      baseUrl.searchParams.append(...arr);
    }
  });

  apiLinkDiv.style.display = "block";
  apiLinkDiv.textContent = baseUrl.href;

  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function timedOutMsg(elemName = "clipboard", message) {
  if (elemName === "clipboard") {
    errorBox.textContent = message;
    errorBox.classList.toggle("visible");
    setTimeout(() => {
      errorBox.classList.toggle("visible");
      setTimeout(() => {
        errorBox.textContent = "";
      }, 1000);
    }, 2000);
  }
}

const clipBoardFn = function (e) {
  const textContent = e.target.textContent;
  navigator.clipboard
    .writeText(textContent)
    .then(
      timedOutMsg.bind({}, "clipboard", "Link copied to clipboard"),
      timedOutMsg.bind({}, "clipboard", "Couldn't copy")
    );
};

retrieveRenderCategoriesOrCountries(categories_select, "categories");
retrieveRenderCategoriesOrCountries(countries_select, "countries");

api_form.addEventListener("submit", handleGenAPILink);
apiLinkDiv.addEventListener("click", clipBoardFn);
