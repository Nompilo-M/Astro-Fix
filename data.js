const storage = {
  save: (k, v) => {
    localStorage.setItem(k, JSON.stringify(v));
    if (k === "bf_issues") setTimeout(() => renderInspectorFooter(), 10);
  },
  load: (k) => {
    try {
      return JSON.parse(localStorage.getItem(k)) || [];
    } catch (e) {
      return [];
    }
  },
};

const getVal = (id) => document.getElementById(id)?.value?.trim() || "";
const today = () => new Date().toISOString().slice(0, 10);

function generateId() {
  const issues = storage.load("bf_issues");
  let maxNum = 0;
  issues.forEach((issue) => {
    if (typeof issue.id === "string" && issue.id.startsWith("i")) {
      const num = parseInt(issue.id.slice(1), 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  });
  return "i" + String(maxNum + 1).padStart(3, "0");
}

function computeStatus(selectedStatus, targetDate, actualDate) {
  if (actualDate) return "resolved";
  const todayStr = new Date().toISOString().slice(0, 10);
  if (targetDate && targetDate < todayStr && selectedStatus !== "resolved")
    return "overdue";
  return selectedStatus || "open";
}

function applySort(arr, sort, alphaKey, idKey) {
  if (sort === "asc-alpha")
    return [...arr].sort((a, b) =>
      String(a[alphaKey]).localeCompare(String(b[alphaKey])),
    );
  if (sort === "desc-alpha")
    return [...arr].sort((a, b) =>
      String(b[alphaKey]).localeCompare(String(a[alphaKey])),
    );
  if (sort === "asc-id")
    return [...arr].sort((a, b) => (a[idKey] > b[idKey] ? 1 : -1));
  if (sort === "desc-id")
    return [...arr].sort((a, b) => (a[idKey] < b[idKey] ? 1 : -1));
  return arr;
}

(function seed() {
  if (!storage.load("people").length) {
    storage.save("people", [
      {
        id: 1,
        name: "Themba",
        surname: "Mokoena",
        email: "themba@test.com",
        username: "tmokoena",
      },
      {
        id: 2,
        name: "Sarah",
        surname: "Naidoo",
        email: "sarah@test.com",
        username: "snaidoo",
      },
      {
        id: 3,
        name: "Lebo",
        surname: "Dlamini",
        email: "lebo@test.com",
        username: "ldlamini",
      },
      {
        id: 4,
        name: "Mpho",
        surname: "Sithole",
        email: "mpho@test.com",
        username: "msithole",
      },
      {
        id: 5,
        name: "Zanele",
        surname: "Khumalo",
        email: "zanele@test.com",
        username: "zkhumalo",
      },
    ]);
  }
  if (!storage.load("projects").length) {
    storage.save("projects", [
      { id: 101, name: "Portal Redesign" },
      { id: 102, name: "Mobile App v2" },
      { id: 103, name: "API Gateway" },
    ]);
  }
  if (!storage.load("bf_issues").length) {
    storage.save("bf_issues", [
      {
        id: "i001",
        summary: "Login button not working",
        description: "Users cannot log in on Chrome.",
        project: 101,
        identifiedBy: 1,
        assignee: 2,
        priority: "high",
        status: "open",
        dateIdentified: "2025-01-05",
        targetDate: "2025-01-15",
        actualDate: "",
        resolution: "",
      },
      {
        id: "i002",
        summary: "Search returns wrong results",
        description: "Search ignores filters.",
        project: 102,
        identifiedBy: 2,
        assignee: 3,
        priority: "medium",
        status: "open",
        dateIdentified: "2025-01-08",
        targetDate: "2025-01-20",
        actualDate: "",
        resolution: "",
      },
      {
        id: "i003",
        summary: "Profile picture not uploading",
        description: "Image upload fails silently.",
        project: 101,
        identifiedBy: 1,
        assignee: 4,
        priority: "low",
        status: "resolved",
        dateIdentified: "2025-01-10",
        targetDate: "2025-01-18",
        actualDate: "2025-01-17",
        resolution: "Fixed S3 bucket permissions.",
      },
      {
        id: "i004",
        summary: "Dashboard crashes on load",
        description: "NullPointerException on dashboard init.",
        project: 103,
        identifiedBy: 3,
        assignee: 1,
        priority: "high",
        status: "overdue",
        dateIdentified: "2024-12-01",
        targetDate: "2024-12-10",
        actualDate: "",
        resolution: "",
      },
      {
        id: "i005",
        summary: "Email notifications delayed",
        description: "Emails arrive 2 hours late.",
        project: 102,
        identifiedBy: 5,
        assignee: 2,
        priority: "medium",
        status: "open",
        dateIdentified: "2025-01-12",
        targetDate: "2025-02-01",
        actualDate: "",
        resolution: "",
      },
      {
        id: "i006",
        summary: "Export to CSV is slow",
        description: "Takes 5 minutes for 1000 rows.",
        project: 103,
        identifiedBy: 2,
        assignee: 5,
        priority: "medium",
        status: "open",
        dateIdentified: "2025-01-14",
        targetDate: "2025-02-05",
        actualDate: "",
        resolution: "",
      },
      {
        id: "i007",
        summary: "Mobile layout broken on iOS",
        description: "Buttons overlap on iPhone SE.",
        project: 102,
        identifiedBy: 4,
        assignee: 3,
        priority: "high",
        status: "overdue",
        dateIdentified: "2024-11-20",
        targetDate: "2024-12-01",
        actualDate: "",
        resolution: "",
      },
      {
        id: "i008",
        summary: "Typo on landing page",
        description: "'Recieve' should be 'Receive'.",
        project: 101,
        identifiedBy: 1,
        assignee: 1,
        priority: "low",
        status: "resolved",
        dateIdentified: "2025-01-02",
        targetDate: "2025-01-05",
        actualDate: "2025-01-04",
        resolution: "Fixed copy.",
      },
      {
        id: "i009",
        summary: "Password reset link expires",
        description: "Link expires after 1 min not 1 hour.",
        project: 103,
        identifiedBy: 3,
        assignee: 4,
        priority: "high",
        status: "open",
        dateIdentified: "2025-01-15",
        targetDate: "2025-01-25",
        actualDate: "",
        resolution: "",
      },
      {
        id: "i010",
        summary: "Dark mode toggle resets on nav",
        description: "Preference not persisted.",
        project: 101,
        identifiedBy: 2,
        assignee: 5,
        priority: "low",
        status: "open",
        dateIdentified: "2025-01-16",
        targetDate: "2025-02-10",
        actualDate: "",
        resolution: "",
      },
    ]);
  }
})();

function addPerson(name, surname, email, username) {
  const people = storage.load("people");
  people.push({ id: people.length + 1, name, surname, email, username });
  storage.save("people", people);
  renderPeople();
  renderTeamDirectory();
  populateDropdowns();
}

function renderPeople() {
  const tbody = document.getElementById("people-tbody");
  if (!tbody) return;
  const search =
    document.querySelector(".search-input")?.value?.toLowerCase() || "";
  const sort = localStorage.getItem("activeSort") || "asc-id";

  let people = storage
    .load("people")
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.username.toLowerCase().includes(search) ||
        p.email.toLowerCase().includes(search),
    );
  people = applySort(people, sort, "name", "id");

  tbody.innerHTML = "";
  people.forEach((p) => {
    const tr = document.createElement("tr");
    tr.dataset.personId = p.id;
    tr.style.cursor = "pointer";
    [p.id, `${p.name} ${p.surname}`, p.email, p.username].forEach((text) => {
      const td = document.createElement("td");
      td.textContent = text;
      tr.appendChild(td);
    });
    tr.addEventListener("click", () => toggleInspectorItem("person", p.id));
    tbody.appendChild(tr);
  });
}

function renderTeamDirectory() {
  const container = document.getElementById("people-display");
  if (!container) return;

  const search =
    document.querySelector(".search-input")?.value?.toLowerCase() || "";
  const sort = localStorage.getItem("activeSort") || "asc-id";
  const filters =
    typeof getActiveFilters === "function" ? getActiveFilters() : {};

  const people = storage.load("people");
  const issues = storage.load("bf_issues");
  const projects = storage.load("projects");

  let filtered = people.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search) ||
      p.surname.toLowerCase().includes(search) ||
      p.username.toLowerCase().includes(search),
  );
  filtered = applySort(filtered, sort, "name", "id");

  container.innerHTML = "";
  filtered.forEach((person) => {
    let personIssues = issues.filter((i) => i.assignee == person.id);
    if (filters.status)
      personIssues = personIssues.filter((i) => i.status === filters.status);
    if (filters.priority)
      personIssues = personIssues.filter(
        (i) => i.priority === filters.priority,
      );

    const card = document.createElement("div");
    card.className = "team-directory-card";

    const header = document.createElement("div");
    header.className = "team-dir-header";
    header.innerHTML = `
      <div class="team-dir-avatar">${person.name[0]}${person.surname[0]}</div>
      <div>
        <div class="team-dir-name">${person.name} ${person.surname}</div>
        <div class="team-dir-username">@${person.username}</div>
      </div>
      <div class="team-dir-count">${personIssues.length} issue${personIssues.length !== 1 ? "s" : ""}</div>
    `;
    card.appendChild(header);

    if (personIssues.length === 0) {
      const empty = document.createElement("p");
      empty.className = "team-dir-empty";
      empty.textContent = "No issues assigned";
      card.appendChild(empty);
    } else {
      const tableWrap = document.createElement("div");
      tableWrap.className = "table-wrapper";
      const table = document.createElement("table");
      table.className = "data-table team-dir-table";
      table.innerHTML = `<thead><tr><th>Issue</th><th>Project</th><th>Status</th></tr></thead>`;
      const tbody = document.createElement("tbody");
      personIssues.forEach((issue) => {
        const project = projects.find((p) => p.id == issue.project);
        const statusColors = {
          open: "#3498db",
          resolved: "#27ae60",
          overdue: "#e74c3c",
        };
        const tr = document.createElement("tr");
        tr.dataset.issueId = issue.id;
        tr.innerHTML = `
          <td title="${issue.summary}">${issue.id} — ${issue.summary.length > 28 ? issue.summary.slice(0, 28) + "…" : issue.summary}</td>
          <td>${project ? project.name : "—"}</td>
          <td><span class="team-dir-status-badge" style="background:${statusColors[issue.status] || "#999"}">${issue.status}</span></td>
        `;
        tr.addEventListener("click", () =>
          toggleInspectorItem("issue", issue.id),
        );
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      tableWrap.appendChild(table);
      card.appendChild(tableWrap);
    }
    container.appendChild(card);
  });
}

function addProject(name) {
  const projects = storage.load("projects");
  projects.push({ id: projects.length + 101, name });
  storage.save("projects", projects);
  renderProjects();
  populateDropdowns();
}

function renderProjects() {
  const list = document.getElementById("projects-display");
  if (!list) return;
  const search =
    document.querySelector(".search-input")?.value?.toLowerCase() || "";
  const sort = localStorage.getItem("activeSort") || "asc-id";

  let projects = storage
    .load("projects")
    .filter((p) => p.name.toLowerCase().includes(search));
  projects = applySort(projects, sort, "name", "id");

  list.innerHTML = "";
  projects.forEach((p) => {
    const li = document.createElement("li");
    li.className = "project-item";
    li.dataset.projectId = p.id;
    li.style.cursor = "pointer";
    li.textContent = `#${p.id} ${p.name}`;
    li.addEventListener("click", () => toggleInspectorItem("project", p.id));
    list.appendChild(li);
  });
}

function populateDropdowns() {
  const p = document.getElementById("f-project");
  const idBy = document.getElementById("f-identified-by");
  const asg = document.getElementById("f-assignee");
  if (p) {
    p.innerHTML = '<option value="">— Select Project —</option>';
    storage.load("projects").forEach((pr) => {
      p.innerHTML += `<option value="${pr.id}">${pr.name}</option>`;
    });
  }
  [idBy, asg].forEach((sel) => {
    if (!sel) return;
    sel.innerHTML = '<option value="">— Select Person —</option>';
    storage.load("people").forEach((pe) => {
      sel.innerHTML += `<option value="${pe.id}">${pe.name} ${pe.surname}</option>`;
    });
  });
}

function setupCreateTicketPills() {
  [
    ["status-row", "f-status"],
    ["priority-row", "f-priority"],
  ].forEach(([rowId, inputId]) => {
    const row = document.getElementById(rowId);
    const input = document.getElementById(inputId);
    if (!row || !input) return;
    row.querySelectorAll(".pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        row
          .querySelectorAll(".pill")
          .forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        input.value = btn.dataset.val;
      });
    });
  });
}
let editingIssueId = null;

function saveIssue() {
  const issues = storage.load("bf_issues");

  if (editingIssueId) {
    const issue = issues.find((i) => i.id === editingIssueId);
    if (!issue) return;

    issue.summary = getVal("edit-summary");
    issue.description = getVal("edit-description");
    issue.resolution = getVal("edit-resolution-summary");

    issue.identifiedBy = getVal("edit-identified-by");
    issue.assignee = getVal("edit-assigned-to");
    issue.project = getVal("edit-project");

    issue.dateIdentified = getVal("edit-date-identified");
    issue.targetDate = getVal("edit-target-date");
    issue.actualDate = getVal("edit-actual-date");

    issue.priority = getVal("edit-priority");
    issue.status = computeStatus(
      getVal("edit-status"),
      issue.targetDate,
      issue.actualDate,
    );

    storage.save("bf_issues", issues);
    editingIssueId = null;

    showView("assign-view");
    return;
  }

  const newIssue = {
    id: generateId(),
    summary: getVal("f-summary"),
    description: getVal("f-description"),
    project: getVal("f-project"),
    identifiedBy: getVal("f-identified-by"),
    assignee: getVal("f-assignee"),
    priority: getVal("f-priority"),
    status: computeStatus(getVal("f-status"), getVal("f-target-date"), ""),
    dateIdentified: getVal("f-date-identified"),
    targetDate: getVal("f-target-date"),
    actualDate: "",
    resolution: "",
  };

  issues.push(newIssue);
  storage.save("bf_issues", issues);
  showView("assign-view");
}

function renderAssignList() {
  const tbody = document.getElementById("assign-list");
  if (!tbody) return;

  const issues = storage.load("bf_issues");
  const people = storage.load("people");
  const projects = storage.load("projects");
  const search =
    document.querySelector(".search-input")?.value?.toLowerCase() || "";
  const sort = localStorage.getItem("activeSort") || "asc-id";

  let filtered = issues.filter(
    (issue) =>
      !search ||
      issue.summary.toLowerCase().includes(search) ||
      issue.status.toLowerCase().includes(search) ||
      issue.priority.toLowerCase().includes(search),
  );

  if (typeof applyFiltersToIssues === "function")
    filtered = applyFiltersToIssues(filtered);
  filtered = applySort(filtered, sort, "summary", "id");

  tbody.innerHTML = "";
  filtered.forEach((issue) => {
    const tr = document.createElement("tr");
    tr.dataset.issueId = issue.id;
    if (
      inspectorSelectedIds.some((s) => s.type === "issue" && s.id == issue.id)
    ) {
      tr.classList.add("inspector-selected");
    }

    const project = projects.find((p) => p.id == issue.project);
    const assignee = people.find((p) => p.id == issue.assignee);

    [
      issue.id,
      issue.summary,
      issue.status,
      issue.priority,
      project ? project.name : "—",
      assignee ? `${assignee.name} ${assignee.surname}` : "Unassigned",
    ].forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });

    tr.addEventListener("click", (e) => {
      if (e.target.closest("select, button")) return;
      toggleInspectorItem("issue", issue.id);
    });
    tbody.appendChild(tr);
  });
}

function applyAssignment(issueId) {
  const sel = document.getElementById(`sel-${issueId}`);
  if (!sel) return;
  const issues = storage.load("bf_issues");
  const issue = issues.find((i) => i.id === issueId);
  if (!issue) return;
  issue.assignee = sel.value;
  storage.save("bf_issues", issues);
  renderAssignList();
  renderTeamDirectory();
}

function showView(viewId) {
  document.querySelectorAll(".content-view").forEach((v) => {
    v.classList.toggle("hidden", v.id !== viewId);
  });
  if (typeof updateHeaderForView === "function") updateHeaderForView(viewId);
  populateDropdowns();
  if (viewId === "mgmt-view") {
    renderPeople();
    renderProjects();
    renderTeamDirectory();
  }
  if (viewId === "assign-view") {
    renderAssignList();
  }

  if (viewId === "edit-view") {
    populateEditIssueList();
    populateEditDropdowns();
  }
  if (viewId === "kanban-view") {
    renderKanban();
  }
}

let inspectorSelectedIds = [];
const INSPECTOR_MAX = 4;

function toggleInspectorItem(type, id) {
  const strId = String(id);
  const idx = inspectorSelectedIds.findIndex(
    (s) => s.type === type && String(s.id) === strId,
  );

  if (idx !== -1) {
    inspectorSelectedIds.splice(idx, 1);
  } else {
    if (inspectorSelectedIds.length >= INSPECTOR_MAX)
      inspectorSelectedIds.shift();
    inspectorSelectedIds.push({ type, id: strId });
  }

  document.querySelectorAll("tr[data-issue-id]").forEach((tr) => {
    tr.classList.toggle(
      "inspector-selected",
      inspectorSelectedIds.some(
        (s) => s.type === "issue" && s.id === tr.dataset.issueId,
      ),
    );
  });
  document.querySelectorAll("tr[data-person-id]").forEach((tr) => {
    tr.classList.toggle(
      "inspector-selected",
      inspectorSelectedIds.some(
        (s) => s.type === "person" && s.id === String(tr.dataset.personId),
      ),
    );
  });
  document.querySelectorAll("li[data-project-id]").forEach((li) => {
    li.classList.toggle(
      "inspector-selected",
      inspectorSelectedIds.some(
        (s) => s.type === "project" && s.id === String(li.dataset.projectId),
      ),
    );
  });

  document.querySelectorAll(".kanban-card[data-issue-id]").forEach((card) => {
    card.classList.toggle(
      "inspector-selected",
      inspectorSelectedIds.some(
        (s) => s.type === "issue" && s.id === card.dataset.issueId,
      ),
    );
  });

  renderInspectorFooter();
}

function clearInspectorSelection() {
  inspectorSelectedIds = [];
  document
    .querySelectorAll(".inspector-selected")
    .forEach((el) => el.classList.remove("inspector-selected"));
  renderInspectorFooter();
}

function renderInspectorFooter() {
  const container = document.getElementById("inspector-content");
  if (!container) return;
  container.innerHTML = "";

  const issues = storage.load("bf_issues");
  const people = storage.load("people");
  const projects = storage.load("projects");

  inspectorSelectedIds = inspectorSelectedIds.filter((s) => {
    if (s.type === "issue") return issues.some((i) => i.id === s.id);
    if (s.type === "person") return people.some((p) => String(p.id) === s.id);
    if (s.type === "project")
      return projects.some((p) => String(p.id) === s.id);
    return false;
  });

  if (!inspectorSelectedIds.length) {
    const placeholder = document.createElement("span");
    placeholder.textContent =
      "Click any row or project to pin it here (up to 4)";
    container.appendChild(placeholder);
    return;
  }

  const cardsRow = document.createElement("div");
  cardsRow.className = "inspector-cards-row";

  inspectorSelectedIds.forEach((sel) => {
    const card = document.createElement("div");
    card.className = "inspector-card";

    if (sel.type === "issue") {
      const issue = issues.find((i) => i.id === sel.id);
      if (!issue) return;
      const project = projects.find((p) => p.id == issue.project);
      const assignee = people.find((p) => p.id == issue.assignee);
      const pColors = { high: "#e74c3c", medium: "#f39c12", low: "#27ae60" };
      const sColors = {
        open: "#3498db",
        resolved: "#27ae60",
        overdue: "#e74c3c",
      };
      card.innerHTML = `
        <div class="inspector-card-header">
          <span class="inspector-card-type-badge" style="background:#8874fc">ISSUE</span>
          <span class="inspector-card-id">#${issue.id}</span>
          <span class="inspector-card-badge" style="background:${pColors[issue.priority] || "#999"}">${(issue.priority || "low").toUpperCase()}</span>
          <span class="inspector-card-badge" style="background:${sColors[issue.status] || "#999"}">${issue.status}</span>
          <button class="inspector-card-close" data-type="issue" data-id="${sel.id}" title="Deselect">✕</button>
        </div>
        <div class="inspector-card-summary" title="${issue.summary}">${issue.summary}</div>
        <div class="inspector-card-meta">
          <span>📁 ${project ? project.name : "—"}</span>
          <span>👤 ${assignee ? `${assignee.name} ${assignee.surname}` : "Unassigned"}</span>
        </div>
        <button class="inspector-card-delete" data-type="issue" data-id="${sel.id}">🗑 Delete Issue</button>
      `;
    } else if (sel.type === "person") {
      const person = people.find((p) => String(p.id) === sel.id);
      if (!person) return;
      const assigned = issues.filter((i) => i.assignee == person.id).length;
      card.innerHTML = `
        <div class="inspector-card-header">
          <span class="inspector-card-type-badge" style="background:#27ae60">PERSON</span>
          <span class="inspector-card-id">#${person.id}</span>
          <button class="inspector-card-close" data-type="person" data-id="${sel.id}" title="Deselect">✕</button>
        </div>
        <div class="inspector-card-summary">${person.name} ${person.surname}</div>
        <div class="inspector-card-meta">
          <span>📧 ${person.email}</span>
          <span>🎫 ${assigned} issue${assigned !== 1 ? "s" : ""}</span>
        </div>
        <button class="inspector-card-delete" data-type="person" data-id="${sel.id}">🗑 Delete Person</button>
      `;
    } else if (sel.type === "project") {
      const project = projects.find((p) => String(p.id) === sel.id);
      if (!project) return;
      const issueCount = issues.filter((i) => i.project == project.id).length;
      card.innerHTML = `
        <div class="inspector-card-header">
          <span class="inspector-card-type-badge" style="background:#f39c12">PROJECT</span>
          <span class="inspector-card-id">#${project.id}</span>
          <button class="inspector-card-close" data-type="project" data-id="${sel.id}" title="Deselect">✕</button>
        </div>
        <div class="inspector-card-summary">${project.name}</div>
        <div class="inspector-card-meta">
          <span>🎫 ${issueCount} linked issue${issueCount !== 1 ? "s" : ""}</span>
        </div>
        <button class="inspector-card-delete" data-type="project" data-id="${sel.id}">🗑 Delete Project</button>
      `;
    }

    cardsRow.appendChild(card);
  });

  const clearBtn = document.createElement("button");
  clearBtn.className = "inspector-clear-all";
  clearBtn.textContent = "Clear All";
  clearBtn.onclick = clearInspectorSelection;

  container.appendChild(cardsRow);
  container.appendChild(clearBtn);
}

document.addEventListener("click", (e) => {
  // Deselect (✕)
  const closeBtn = e.target.closest(".inspector-card-close");
  if (closeBtn) {
    const { type, id } = closeBtn.dataset;
    inspectorSelectedIds = inspectorSelectedIds.filter(
      (s) => !(s.type === type && s.id === id),
    );
    document
      .querySelectorAll(`[data-${type}-id="${id}"]`)
      .forEach((el) => el.classList.remove("inspector-selected"));
    renderInspectorFooter();
    return;
  }

  const deleteBtn = e.target.closest(".inspector-card-delete");
  if (!deleteBtn) return;
  const { type, id } = deleteBtn.dataset;

  if (type === "issue") {
    if (!confirm("Delete this issue permanently?")) return;
    const issues = storage.load("bf_issues");
    const idx = issues.findIndex((i) => i.id === id);
    if (idx !== -1) {
      issues.splice(idx, 1);
      storage.save("bf_issues", issues);
    }
    renderAssignList();
    renderTeamDirectory();
  } else if (type === "person") {
    if (!confirm("Delete this person? Their issues will become unassigned."))
      return;
    let people = storage.load("people");
    people = people.filter((p) => String(p.id) !== id);
    storage.save("people", people);
    // Unassign their issues
    const issues = storage.load("bf_issues");
    issues.forEach((i) => {
      if (String(i.assignee) === id) i.assignee = "";
    });
    storage.save("bf_issues", issues);
    renderPeople();
    renderTeamDirectory();
    renderAssignList();
    populateDropdowns();
  } else if (type === "project") {
    if (
      !confirm(
        "Delete this project? Issues linked to it will lose their project.",
      )
    )
      return;
    let projects = storage.load("projects");
    projects = projects.filter((p) => String(p.id) !== id);
    storage.save("projects", projects);
    // Clear project ref from issues
    const issues = storage.load("bf_issues");
    issues.forEach((i) => {
      if (String(i.project) === id) i.project = "";
    });
    storage.save("bf_issues", issues);
    renderProjects();
    renderAssignList();
    populateDropdowns();
  }

  inspectorSelectedIds = inspectorSelectedIds.filter(
    (s) => !(s.type === type && s.id === id),
  );
  renderInspectorFooter();
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("person-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    addPerson(
      getVal("p-name"),
      getVal("p-surname"),
      getVal("p-email"),
      getVal("p-username"),
    );
    e.target.reset();
  });

  document.getElementById("project-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    addProject(getVal("proj-name"));
    e.target.reset();
  });

  setupCreateTicketPills();
  populateDropdowns();
  renderPeople();
  renderProjects();
  renderTeamDirectory();
  renderAssignList();
  renderInspectorFooter();
});

function renderKanban() {
  const container = document.querySelector("#kanban-view article");
  if (!container) return;

  const search =
    document.querySelector(".search-input")?.value?.toLowerCase() || "";
  const sort = localStorage.getItem("activeSort") || "asc-id";

  let issues = storage.load("bf_issues");
  const people = storage.load("people");
  const projects = storage.load("projects");

  if (search) {
    issues = issues.filter(
      (i) =>
        i.summary.toLowerCase().includes(search) ||
        i.priority.toLowerCase().includes(search) ||
        i.id.toLowerCase().includes(search),
    );
  }

  if (typeof applyFiltersToIssues === "function") {
    issues = applyFiltersToIssues(issues);
  }

  issues = applySort(issues, sort, "summary", "id");

  container.innerHTML = "";

  const statuses = ["open", "overdue", "resolved"];
  const board = document.createElement("div");
  board.className = "kanban-board";

  statuses.forEach((status) => {
    const col = document.createElement("div");
    col.className = "kanban-column";

    const colIssues = issues.filter((i) => i.status === status);
    col.innerHTML = `<h2>${status.toUpperCase()} <span style="font-size:13px;font-weight:normal;opacity:0.7">(${colIssues.length})</span></h2>`;

    if (colIssues.length === 0) {
      const empty = document.createElement("p");
      empty.style.cssText =
        "text-align:center;color:#999;font-size:13px;font-style:italic;margin-top:10px;";
      empty.textContent = "No issues";
      col.appendChild(empty);
    }

    colIssues.forEach((issue) => {
      const assignee = people.find((p) => p.id == issue.assignee);
      const project = projects.find((p) => p.id == issue.project);
      const pColors = { high: "#e74c3c", medium: "#f39c12", low: "#27ae60" };

      const card = document.createElement("div");
      card.className = "kanban-card";
      card.dataset.issueId = issue.id;
      if (
        inspectorSelectedIds.some(
          (s) => s.type === "issue" && s.id === issue.id,
        )
      ) {
        card.classList.add("inspector-selected");
      }
      card.innerHTML = `
          <div class="id" style="display:flex;justify-content:space-between;align-items:center;">
            <span>${issue.id}</span>
            <span style="background:${pColors[issue.priority] || "#999"};color:#fff;padding:2px 7px;border-radius:8px;font-size:10px;font-weight:700;">${(issue.priority || "").toUpperCase()}</span>
          </div>
          <div class="summary">${issue.summary}</div>
          <div class="meta">
            <span>📁 ${project ? project.name : "—"}</span>
            <span>👤 ${assignee ? assignee.name : "Unassigned"}</span>
          </div>
        `;

      card.onclick = () => toggleInspectorItem("issue", issue.id);
      col.appendChild(card);
    });

    board.appendChild(col);
  });

  container.appendChild(board);
}

function populateEditIssueList() {
  const select = document.getElementById("issue-select");
  if (!select) return;

  select.innerHTML = `<option value="">— choose an issue —</option>`;

  storage.load("bf_issues").forEach((issue) => {
    const opt = document.createElement("option");
    opt.value = issue.id;
    opt.textContent = `${issue.id} — ${issue.summary}`;
    select.appendChild(opt);
  });
}

function loadIssue() {
  const select = document.getElementById("issue-select");
  editingIssueId = select.value;
  if (!editingIssueId) return;

  const issue = storage.load("bf_issues").find((i) => i.id === editingIssueId);
  if (!issue) return;

  document.getElementById("empty-state")?.style &&
    (document.getElementById("empty-state").style.display = "none");
  document.getElementById("edit-form").style.display = "block";

  document.getElementById("edit-summary").value = issue.summary;
  document.getElementById("edit-description").value = issue.description;
  document.getElementById("edit-resolution-summary").value =
    issue.resolution || "";

  document.getElementById("edit-identified-by").value = issue.identifiedBy;
  document.getElementById("edit-assigned-to").value = issue.assignee;
  document.getElementById("edit-project").value = issue.project;

  document.getElementById("edit-date-identified").value = issue.dateIdentified;
  document.getElementById("edit-target-date").value = issue.targetDate;
  document.getElementById("edit-actual-date").value = issue.actualDate || "";

  document.getElementById("edit-status").value = issue.status;
  document.getElementById("edit-priority").value = issue.priority;

  document
    .querySelectorAll("#edit-status-row .pill")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll("#edit-priority-row .pill")
    .forEach((p) => p.classList.remove("active"));

  [...document.querySelectorAll("#edit-status-row .pill")]
    .find((p) => p.textContent.trim() === issue.status)
    ?.classList.add("active");

  [...document.querySelectorAll("#edit-priority-row .pill")]
    .find((p) => p.textContent.trim() === issue.priority)
    ?.classList.add("active");
}

function cancelEdit() {
  editingIssueId = null;
  showView("mgmt-view");
}

function editSetStatus(value) {
  document.getElementById("edit-status").value = value;

  const row = document.getElementById("edit-status-row");
  row.querySelectorAll(".pill").forEach((p) => p.classList.remove("active"));
  event.target.classList.add("active");
}

function editSetPriority(value) {
  document.getElementById("edit-priority").value = value;

  const row = document.getElementById("edit-priority-row");
  row.querySelectorAll(".pill").forEach((p) => p.classList.remove("active"));
  event.target.classList.add("active");
}

function populateEditDropdowns() {
  const people = storage.load("people");
  const projects = storage.load("projects");

  const identified = document.getElementById("edit-identified-by");
  const assigned = document.getElementById("edit-assigned-to");
  const projectSel = document.getElementById("edit-project");

  if (identified) {
    identified.innerHTML = `<option value="">— Select Person —</option>`;
    people.forEach((p) => {
      identified.innerHTML += `<option value="${p.id}">${p.name} ${p.surname}</option>`;
    });
  }

  if (assigned) {
    assigned.innerHTML = `<option value="">— Select Person —</option>`;
    people.forEach((p) => {
      assigned.innerHTML += `<option value="${p.id}">${p.name} ${p.surname}</option>`;
    });
  }

  if (projectSel) {
    projectSel.innerHTML = `<option value="">— Select Project —</option>`;
    projects.forEach((pr) => {
      projectSel.innerHTML += `<option value="${pr.id}">${pr.name}</option>`;
    });
  }
}
