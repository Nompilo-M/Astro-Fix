let currentView = "mgmt-view";

const activeFilters = {
  "mgmt-view": { status: "", priority: "" },
  "assign-view": { status: "", priority: "" },
  "issue-view": {},
  "edit-view": { status: "", priority: "" },
  "kanban-view": { status: "", priority: "" },
};

const filterConfig = {
  "issue-view": [],
  "mgmt-view": [
    {
      id: "filter-status",
      label: "Issue Status (Team Directory)",
      options: [
        { value: "", label: "All Statuses" },
        { value: "open", label: "Open" },
        { value: "resolved", label: "Resolved" },
        { value: "overdue", label: "Overdue" },
      ],
    },
    {
      id: "filter-priority",
      label: "Issue Priority (Team Directory)",
      options: [
        { value: "", label: "All Priorities" },
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
      ],
    },
  ],
  "assign-view": [
    {
      id: "filter-status",
      label: "Status",
      options: [
        { value: "", label: "All Statuses" },
        { value: "open", label: "Open" },
        { value: "resolved", label: "Resolved" },
        { value: "overdue", label: "Overdue" },
      ],
    },
    {
      id: "filter-priority",
      label: "Priority",
      options: [
        { value: "", label: "All Priorities" },
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
      ],
    },
  ],
  "edit-view": [],
  "kanban-view": [
    {
      id: "filter-priority",
      label: "Priority",
      options: [
        { value: "", label: "All Priorities" },
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
      ],
    },
  ],
};

function getActiveFilters() {
  return activeFilters[currentView] || {};
}

function applyFiltersToIssues(issues) {
  const filters = getActiveFilters();
  return issues.filter((issue) => {
    if (filters.status && issue.status !== filters.status) return false;
    if (filters.priority && issue.priority !== filters.priority) return false;
    return true;
  });
}

function updateHeaderForView(viewId) {
  currentView = viewId;

  const viewsWithSort = ["mgmt-view", "assign-view", "kanban-view"];
  const sortSelect = document.querySelector(
    "header .controls-container .dropdown",
  );
  const filterBtn = document.querySelector("header .filter-btn");

  if (sortSelect)
    sortSelect.style.display = viewsWithSort.includes(viewId) ? "" : "none";
  if (filterBtn) {
    filterBtn.style.display =
      (filterConfig[viewId] || []).length > 0 ? "" : "none";
  }

  closeFilterPopup();
}

function refreshActiveView() {
  if (currentView === "mgmt-view") {
    renderPeople();
    renderProjects();
    renderTeamDirectory();
  }
  if (currentView === "assign-view") {
    renderAssignList();
  }
  if (currentView === "edit-view" && typeof renderEditList === "function")
    renderEditList();
  if (currentView === "kanban-view" && typeof renderKanban === "function")
    renderKanban();
}

function openFilterPopup() {
  const fields = filterConfig[currentView] || [];
  if (!fields.length) return;

  const popup = document.getElementById("filter-modal");
  const content = document.getElementById("filter-fields");
  const title = document.getElementById("filter-title");
  if (!popup || !content) return;

  const viewTitles = {
    "mgmt-view": "Filter Team Directory",
    "assign-view": "Filter Issues",
    "edit-view": "Filter Issues",
    "kanban-view": "Filter by Priority",
  };
  if (title) title.textContent = viewTitles[currentView] || "Filter";

  content.innerHTML = "";
  const filters = getActiveFilters();

  fields.forEach((field) => {
    const wrapper = document.createElement("div");
    wrapper.style.cssText =
      "display:flex;flex-direction:column;gap:4px;margin-bottom:12px;";

    const label = document.createElement("label");
    label.textContent = field.label;
    label.style.cssText = "font-size:13px;font-weight:600;color:#333;";

    const select = document.createElement("select");
    select.id = field.id;
    select.className = "dropdown";
    select.style.cssText =
      "padding:6px 10px;border-radius:6px;border:1px solid #ddd;font-size:13px;width:100%;";

    const filterKey = field.id.replace("filter-", "");
    field.options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.label;
      if ((filters[filterKey] || "") === opt.value) option.selected = true;
      select.appendChild(option);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    content.appendChild(wrapper);
  });

  const hasActive = Object.values(getActiveFilters()).some((v) => v !== "");
  if (hasActive) {
    const indicator = document.createElement("p");
    indicator.style.cssText =
      "font-size:12px;color:#8874fc;margin:0 0 8px;font-weight:600;";
    indicator.textContent = "⚡ Filters active";
    content.insertBefore(indicator, content.firstChild);
  }

  const applyBtn = document.createElement("button");
  applyBtn.textContent = "Apply";
  applyBtn.className = "save-btn";
  applyBtn.style.cssText = "width:100%;margin-top:4px;";
  applyBtn.onclick = applyFiltersFromPopup;
  content.appendChild(applyBtn);

  const clearBtn = document.createElement("button");
  clearBtn.textContent = "Clear Filters";
  clearBtn.className = "save-btn";
  clearBtn.style.cssText =
    "width:100%;margin-top:6px;background:#f0f0f0;color:#333;border:1px solid #ddd;";
  clearBtn.onclick = clearFilters;
  content.appendChild(clearBtn);

  popup.classList.remove("hidden");
}

function applyFiltersFromPopup() {
  const filters = activeFilters[currentView];
  if (!filters) {
    closeFilterPopup();
    return;
  }
  (filterConfig[currentView] || []).forEach((field) => {
    const key = field.id.replace("filter-", "");
    const el = document.getElementById(field.id);
    if (el) filters[key] = el.value;
  });
  closeFilterPopup();
  refreshActiveView();
}

function clearFilters() {
  const filters = activeFilters[currentView];
  if (filters) Object.keys(filters).forEach((k) => (filters[k] = ""));
  closeFilterPopup();
  refreshActiveView();
}

function closeFilterPopup() {
  document.getElementById("filter-modal")?.classList.add("hidden");
}

function initHeaderControls() {
  const searchInput = document.querySelector(".search-input");
  if (searchInput)
    searchInput.addEventListener("input", () => refreshActiveView());

  const sortSelect = document.querySelector(
    "header .controls-container .dropdown",
  );
  if (sortSelect) {
    sortSelect.innerHTML = `
      <option value="asc-id">ID (Low → High)</option>
      <option value="desc-id">ID (High → Low)</option>
      <option value="asc-alpha">A → Z</option>
      <option value="desc-alpha">Z → A</option>
    `;
    sortSelect.addEventListener("change", () => {
      localStorage.setItem("activeSort", sortSelect.value);
      refreshActiveView();
    });
    localStorage.setItem("activeSort", "asc-id");
  }

  const filterBtn = document.querySelector("header .filter-btn");
  if (filterBtn) filterBtn.onclick = openFilterPopup;

  document.addEventListener("click", (e) => {
    const popup = document.getElementById("filter-modal");
    if (!popup || popup.classList.contains("hidden")) return;
    if (
      !popup.querySelector(".filter-box")?.contains(e.target) &&
      !e.target.closest(".filter-btn")
    ) {
      closeFilterPopup();
    }
  });

  updateHeaderForView(currentView);
}

document.addEventListener("DOMContentLoaded", initHeaderControls);
