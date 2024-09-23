"use strict";

// RUN this function once a user navigates to the dashboard page
const renderDashboard = async function () {
  const he = document.querySelector("h1");
  console.log(he);

  let getMe = {
    method: "get",
    url: "/moderators/me",
  };
  try {
    const response = await auth_routes_instance(getMe);
    console.log(response);
  } catch (error) {
    console.log(error.response);
  }
};

renderDashboard();
