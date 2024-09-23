"use strict";
const sidebarContainer = document.getElementById("sidebar-menu-items");
const contentArea = document.getElementById("content-area");
const pageTitle = document.getElementById("page-title");

const columnFields = ["question", "difficulty", "created_at"];
let globalDashboardData = undefined;

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
    if (response.status == 200) {
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
    <tr class="type-${item.status}-submission-row" data-id=${item.id}>
      ${columnFields.map(generateSubmissionCell.bind({}, item)).join("")}
    </tr>`;
  return content;
}

async function retrieveAndRenderAllSubs(submStatus = "pending") {
  const fetchdashboardData = await getDashboardData(submStatus);
  globalDashboardData = fetchdashboardData
    ? fetchdashboardData.items
    : undefined;

  renderAllSubs(submStatus);
}

async function renderAllSubs(submStatus) {
  const dashboardData = globalDashboardData;

  if (dashboardData === undefined || dashboardData.length === 0) return;
  pageTitle.textContent = `${submStatus.toUpperCase()} SUBMISSIONS`;

  let content = `
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
        </thead>
        <tbody>
            ${dashboardData.map(generateSubmissionRow).join("")}
        </tbody>
    </table>
</div>
`;
  while (contentArea.firstChild) {
    contentArea.removeChild(contentArea.firstChild);
  }
  contentArea.insertAdjacentHTML("afterbegin", content);
}

async function renderSingleSub(el) {
  const dashboardData = globalDashboardData;
  // console.log(dashboardData);
  const subObject = dashboardData.find((val) => val.id === el.dataset.id);
  let content = `
  <div class="submission-content-container" data-id=${subObject.id}>
            <button id="submission-content-back-button">← Back</button>

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
                <div class="cell">Date Submitted</div>
                <div class="cell">${new Date(
                  subObject.created_at
                ).toGMTString()}</div>
              </div>
            </div>

            <div class="submission-content-button-container">
              <button class="action-button approve-button" data-submissionid=${
                subObject.id
              }>Approve</button>
              <button class="action-button reject-button" data-submissionid=${
                subObject.id
              }>Reject</button>
            </div>
          </div>
  `;
  while (contentArea.firstChild) {
    contentArea.removeChild(contentArea.firstChild);
  }
  contentArea.insertAdjacentHTML("afterbegin", content);
}

sidebarContainer.addEventListener("click", function (e) {
  const target = e.target.closest(".menu-item");
  if (target === null) return;

  document.querySelector(".menu-item.active").classList.remove("active");
  target.classList.add("active");
  retrieveAndRenderAllSubs(target.dataset.section);
});

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
      dashboardData.splice(
        dashboardData.findIndex((val) => val.id === submId),
        1
      );
      alert(`Submission ${status}`);
      renderAllSubs("pending");
    }
  } catch (error) {
    console.error(error.response);
  }
}

const handleContentClicks = async function (e) {
  let isTargetSubmissionRow = e.target.closest(".type-pending-submission-row");
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

// Initialize with pending submissions
retrieveAndRenderAllSubs("pending");
