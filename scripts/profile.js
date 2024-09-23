"use strict";
const formElement = document.querySelector("form");
const overlayDiv = document.querySelector(".overlay");
const cancelFormBtn = document.getElementById("reset_btn");
const addListingBtn = document.getElementById("new_listing-btn");

const toggleFormOverlay = function () {
  formElement.parentElement.classList.toggle("hidden");
  overlayDiv.classList.toggle("hidden");
  if (!overlayDiv.classList.contains("hidden")) {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }
};

const toggleWithClick = function (e) {
  const elem = e.target;

  if (elem === overlayDiv || elem === cancelFormBtn || elem === addListingBtn)
    toggleFormOverlay();
};

document.addEventListener("click", toggleWithClick);
