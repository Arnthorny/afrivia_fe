"use strict";

const ENDPOINT_URL = "http://localhost:8000/api/v1";
const BEARER_EXPIRY_MINUTES = 15;
const REFRESH_EXPIRY_DAYS = 15;

let auth_routes_instance, with_cred_instance, unauth_instance;

function handleClickedListing(e) {
  const listing = e.target.closest(".listing");
  if (!listing) return;

  listing.querySelector(".listing_link").click();
}

document.addEventListener("click", handleClickedListing);
