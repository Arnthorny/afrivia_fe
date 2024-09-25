function renderSelectOptions(select_el, l_categories) {
  let content = l_categories
    .map((val) => `<option value="${val}">${val.replace(/-/g, " ")}</option>`)
    .join("");

  select_el.insertAdjacentHTML("beforeend", content);
}

async function retrieveRenderCategoriesOrCountries(
  el,
  countries_or_categories
) {
  let retrieveOptions = {
    method: "get",
    url: `/submissions/${countries_or_categories}`,
  };
  try {
    const response = await unauth_instance(retrieveOptions);
    if (response.status == 200) {
      renderSelectOptions(el, response.data.data);
    }
  } catch (error) {
    alert(`Could not retrieve ${countries_or_categories}`);
    console.log(error && error.response);
  }
}

export { retrieveRenderCategoriesOrCountries };
