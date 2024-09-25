"use strict";
const sidebarContainer = document.getElementById("sidebar-menu-items");
const contentArea = document.getElementById("content-area");
const pageTitle = document.getElementById("page-title");
const userWelcome = document.querySelector(".sidebar h2");

const columnFields = ["question", "difficulty", "created_at"];
let globalDashboardData = undefined;

function welcomeUser() {
  const userName = getCookie("username");
  userWelcome.textContent = `Welcome${userName ? ` ${userName}` : ""}!`;
}

async function getDashboardData(status = "pending") {
  let getSubmOptions = {
    method: "get",
    url: `/assigned-submissions`,
    params: {
      status,
      limit: 20,
    },
  };

  try {
    const response = await auth_routes_instance(getSubmOptions);
    if (response && response.status == 200) {
      const res_data = response.data["data"];
      // console.log(globalDashboardData);
      return res_data;
    }
  } catch (error) {
    console.error(error);
  }
}

function generateSubmissionCell(item, val) {
  const content =
    val === "created_at" || val === "updated_at"
      ? new Date(item[val]).toGMTString()
      : item[val];

  let cell_td = `<td class="pending-submission-cell">${content}</td>`;
  return cell_td;
}

function generateSubmissionRow(item) {
  let content = `
    <tr class="type-submission-row" data-id=${item.id}>
      ${columnFields.map(generateSubmissionCell.bind({}, item)).join("")}
    </tr>`;
  return content;
}

async function retrieveAndRenderAllSubs(submStatus = "pending") {
  const fetchdashboardData = await getDashboardData(submStatus);
  globalDashboardData = fetchdashboardData
    ? fetchdashboardData.items
    : undefined;

  if (globalDashboardData === undefined) return;

  renderAllSubs(submStatus);
}

async function renderAllSubs(submStatus) {
  const dashboardData = globalDashboardData;
  let content, content_head, content_body;

  pageTitle.textContent = `${submStatus.toUpperCase()} SUBMISSIONS`;

  content_head = `
  <div class="item-list">
    <table class="item-table">
        <thead>
            <tr>
                ${columnFields
                  .map(
                    (column) =>
                      `<th>${column.toUpperCase().replace("_", " ")}</th>`
                  )
                  .join("")}
            </tr>
        </thead>`;
  if (dashboardData === undefined || dashboardData.length === 0)
    content = content_head;
  else {
    content_body = `
        <tbody>
            ${dashboardData.map(generateSubmissionRow).join("")}
        </tbody>
    </table>
</div>
`;
    content = `${content_head}${content_body}`;
  }

  while (contentArea.firstChild) {
    contentArea.removeChild(contentArea.firstChild);
  }
  contentArea.insertAdjacentHTML("afterbegin", content);
}

async function renderSingleSub(el) {
  const dashboardData = globalDashboardData;
  let content, content_body, content_buttons;
  const a = [];
  const subObject = dashboardData.find((val) => val.id === el.dataset.id);
  if (subObject === undefined) {
    alert("Submission not found");
    return;
  }

  content_body = `
  <div class="submission-content-container" data-id=${subObject.id}>
            <button id="submission-content-back-button">
            <i class="fas fa-chevron-left"></i>Back</button>

            <div class="flexbox-table">
              <div class="row">
                <div class="cell">Submission ID</div>
                <div class="cell">${subObject.id}</div>
              </div>
              <div class="row">
                <div class="cell">Question</div>
                <div class="cell">${subObject.question}</div>
              </div>
              <div class="row">
                <div class="cell">Correct options</div>
                <div class="cell">${subObject.correct_option}</div>
              </div>
              <div class="row">
                <div class="cell incorrect-options">Incorrect options</div>
                <div class="cell">
                  <ul class="options-list">
                    <li>${subObject.incorrect_options[0]}</li>
                    <li>${subObject.incorrect_options[1]}</li>
                    <li>${subObject.incorrect_options[2]}</li>
                  </ul>
                </div>
              </div>
              <div class="row">
                <div class="cell">Category</div>
                <div class="cell">${subObject.category.replace("-", " ")}</div>
              </div>
              <div class="row">
                <div class="cell">Difficulty</div>
                <div class="cell">${subObject.difficulty}</div>
              </div>
              <div class="row">
                <div class="cell">Associated Countries</div>
                <div class="cell">${subObject.countries.join(",")}</div>
              </div>
              <div class="row">
                <div class="cell">Associated Countries</div>
                <div class="cell">${subObject.submission_note || ""}</div>
              </div>
              <div class="row">
                <div class="cell">Date Submitted</div>
                <div class="cell">${new Date(
                  subObject.created_at
                ).toGMTString()}</div>
              </div>
            </div>
            `;
  content_buttons = `
            <div class="submission-content-button-container">
              <button class="action-button approve-button" data-submissionid=${subObject.id}><i class="far fa-check-circle"></i> Approve</button>
              <button class="action-button reject-button" data-submissionid=${subObject.id}><i class="fas fa-ban"></i> Reject</button>
            </div>
          </div>
  `;

  while (contentArea.firstChild) {
    contentArea.removeChild(contentArea.firstChild);
  }
  content = `${content_body}${
    subObject.status === "pending" ? content_buttons : ""
  }`;

  contentArea.insertAdjacentHTML("afterbegin", content);
}

async function handleUserLogout() {
  let logoutOptions = {
    method: "post",
    url: `/auth/logout`,
  };
  // console.log(approveOptions);
  try {
    const response = await auth_routes_with_cred_instance(logoutOptions);
    if (response.status == 200) {
      deleteCookie("token");
      deleteCookie("username");
      deleteCookie("userId");
      window.location.href = "./login.html";
      alert("Successfully logged out");
    }
  } catch (error) {
    console.error(error && error.response);
  }
}

sidebarContainer.addEventListener("click", function (e) {
  const menu_target = e.target.closest(".menu-item");
  const isLogoutButton = e.target.closest("#logout-button");

  if (menu_target !== null) {
    document.querySelector(".menu-item.active").classList.remove("active");
    menu_target.classList.add("active");
    retrieveAndRenderAllSubs(menu_target.dataset.section);
  } else if (isLogoutButton !== null) {
    handleUserLogout();
  }
});

async function createTrivia(submObject) {
  const {
    question,
    incorrect_options,
    correct_option,
    difficulty,
    category,
    countries,
    id: submissionId,
  } = { ...submObject };

  const triviaObject = {
    question,
    incorrect_options,
    correct_option,
    difficulty,
    category,
    countries,
    submissionId,
  };
  // console.log(triviaObject);
  let postTriviaOptions = {
    method: "post",
    url: "/trivias",
    data: triviaObject,
  };

  try {
    const response = await auth_routes_instance(postTriviaOptions);
    if (response.status == 201) {
      const triviaId = response.data["data"]["id"];
      alert(`Trivia ${triviaId} created successfully`);
    }
  } catch (error) {
    console.log(error && error.response);
  }
}

async function approveRejectButtonHandler(el_) {
  // const el_ = document.querySelector("button");
  const dashboardData = globalDashboardData;
  const status = el_.classList.contains("approve-button")
    ? "approved"
    : "rejected";
  const submId = el_.dataset.submissionid;

  let approveOptions = {
    method: "patch",
    url: `/assigned-submissions/${submId}/review`,
    params: {
      status,
    },
  };
  // console.log(approveOptions);
  try {
    const response = await auth_routes_instance(approveOptions);
    if (response.status == 200) {
      const submObj = dashboardData.splice(
        dashboardData.findIndex((val) => val.id === submId),
        1
      )[0];
      if (status === "approved") createTrivia(submObj);
      alert(`Submission ${status}`);
      renderAllSubs("pending");
    }
  } catch (error) {
    console.error(error.response);
  }
}

const handleContentClicks = async function (e) {
  let isTargetSubmissionRow = e.target.closest(".type-submission-row");
  let isTargetBackButton = e.target.closest("#submission-content-back-button");
  let isTargetApproveRejectButton = e.target.closest("button.action-button");

  if (isTargetSubmissionRow !== null) {
    renderSingleSub(isTargetSubmissionRow);
  } else if (isTargetBackButton !== null) {
    renderAllSubs("pending");
  } else if (isTargetApproveRejectButton !== null) {
    approveRejectButtonHandler(isTargetApproveRejectButton);
  }
};

contentArea.addEventListener("click", handleContentClicks);

// Welcome User
welcomeUser();

// Initialize with pending submissions
retrieveAndRenderAllSubs("pending");
