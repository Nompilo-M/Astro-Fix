// ─── localStorage keys ────────────────────────────────
const KEYS = { issues: 'bt_issues', people: 'bt_people', projects: 'bt_projects' };

function getAll(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function saveAll(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Seed demo data if empty ──────────────────────────
function seedIfEmpty() {
  if (getAll(KEYS.people).length === 0) {
    saveAll(KEYS.people, [
      { id:'p1', name:'Alice',   surname:'Mokoena', email:'alice@dev.co',   username:'alice_m' },
      { id:'p2', name:'Brian',   surname:'Dlamini', email:'brian@dev.co',   username:'brian_d' },
      { id:'p3', name:'Carla',   surname:'Nkosi',   email:'carla@dev.co',   username:'carla_n' },
      { id:'p4', name:'David',   surname:'Sithole', email:'david@dev.co',   username:'david_s' },
    ]);
  }
  if (getAll(KEYS.projects).length === 0) {
    saveAll(KEYS.projects, [
      { id:'pr1', name:'Web Portal' },
      { id:'pr2', name:'Mobile App' },
      { id:'pr3', name:'Admin Dashboard' },
    ]);
  }
  if (getAll(KEYS.issues).length === 0) {
    saveAll(KEYS.issues, [
      { id:'i1',  summary:'Login button unresponsive on mobile',      description:'Tapping login does nothing on Android Chrome.', identifiedBy:'p1', assignedTo:'p2', project:'pr2', status:'open',     priority:'high',   dateIdentified:'2025-03-01', targetDate:'2025-03-10', actualDate:'',         resolutionSummary:'' },
      { id:'i2',  summary:'Dashboard chart not rendering',            description:'Pie chart shows blank on first load.',          identifiedBy:'p2', assignedTo:'p3', project:'pr3', status:'resolved',  priority:'medium', dateIdentified:'2025-03-03', targetDate:'2025-03-08', actualDate:'2025-03-07', resolutionSummary:'Fixed Chart.js version mismatch.' },
      { id:'i3',  summary:'Password reset email not sending',         description:'Users report no email after clicking reset.',   identifiedBy:'p3', assignedTo:'p1', project:'pr1', status:'overdue',   priority:'high',   dateIdentified:'2025-02-20', targetDate:'2025-02-28', actualDate:'',         resolutionSummary:'' },
      { id:'i4',  summary:'Typo on About page',                       description:'"Compnay" should be "Company".',               identifiedBy:'p4', assignedTo:'p4', project:'pr1', status:'resolved',  priority:'low',    dateIdentified:'2025-03-05', targetDate:'2025-03-06', actualDate:'2025-03-05', resolutionSummary:'Corrected spelling in about.html.' },
      { id:'i5',  summary:'Search returns duplicate results',          description:'Same item appears 2-3x in results.',           identifiedBy:'p1', assignedTo:'p2', project:'pr1', status:'open',     priority:'medium', dateIdentified:'2025-03-07', targetDate:'2025-03-15', actualDate:'',         resolutionSummary:'' },
      { id:'i6',  summary:'File upload fails above 5MB',              description:'Large files throw a 500 error.',               identifiedBy:'p2', assignedTo:'p3', project:'pr2', status:'open',     priority:'high',   dateIdentified:'2025-03-08', targetDate:'2025-03-14', actualDate:'',         resolutionSummary:'' },
      { id:'i7',  summary:'Sidebar menu collapses on tablet',         description:'Menu closes immediately after opening.',       identifiedBy:'p3', assignedTo:'p1', project:'pr3', status:'open',     priority:'medium', dateIdentified:'2025-03-09', targetDate:'2025-03-20', actualDate:'',         resolutionSummary:'' },
      { id:'i8',  summary:'Export to CSV missing header row',         description:'Downloaded CSV has no column names.',          identifiedBy:'p4', assignedTo:'p2', project:'pr3', status:'resolved',  priority:'low',    dateIdentified:'2025-03-02', targetDate:'2025-03-09', actualDate:'2025-03-08', resolutionSummary:'Added header row in export function.' },
      { id:'i9',  summary:'Notifications not clearing after read',    description:'Red badge stays even after viewing alerts.',   identifiedBy:'p1', assignedTo:'p4', project:'pr1', status:'overdue',   priority:'medium', dateIdentified:'2025-02-15', targetDate:'2025-02-25', actualDate:'',         resolutionSummary:'' },
      { id:'i10', summary:'Dark mode toggle resets on page refresh',  description:'Preference not persisted in localStorage.',    identifiedBy:'p2', assignedTo:'p1', project:'pr1', status:'open',     priority:'low',    dateIdentified:'2025-03-10', targetDate:'2025-03-18', actualDate:'',         resolutionSummary:'' },
    ]);
  }
}

// ─── State ────────────────────────────────────────────
let currentIssue = null;
let selectedStatus   = '';
let selectedPriority = '';

// ─── Init ─────────────────────────────────────────────
function init() {
  seedIfEmpty();
  populateIssueSelect();
  populatePeopleSelects();
  populateProjectSelect();

  const issues = getAll(KEYS.issues);
  if (issues.length === 0) {
    document.getElementById('empty-state').classList.add('visible');
  }
}

function populateIssueSelect() {
  const sel = document.getElementById('issue-select');
  const issues = getAll(KEYS.issues);
  sel.innerHTML = '<option value="">— choose an issue —</option>';
  issues.forEach(i => {
    const opt = document.createElement('option');
    opt.value = i.id;
    opt.textContent = `[${i.id}] ${i.summary}`;
    sel.appendChild(opt);
  });
}

function populatePeopleSelects() {
  const people = getAll(KEYS.people);
  ['f-identified-by','f-assigned-to'].forEach(id => {
    const sel = document.getElementById(id);
    sel.innerHTML = '<option value="">— select person —</option>';
    people.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = `${p.name} ${p.surname}`;
      sel.appendChild(opt);
    });
  });
}

function populateProjectSelect() {
  const projects = getAll(KEYS.projects);
  const sel = document.getElementById('f-project');
  sel.innerHTML = '<option value="">— select project —</option>';
  projects.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.name;
    sel.appendChild(opt);
  });
}

// ─── Load issue into form ─────────────────────────────
function onIssueSelectChange() {
  // just ready for load button
}

function loadIssue() {
  const id = document.getElementById('issue-select').value;
  if (!id) return;
  const issues = getAll(KEYS.issues);
  currentIssue = issues.find(i => i.id === id);
  if (!currentIssue) return;

  // populate fields
  document.getElementById('f-summary').value            = currentIssue.summary || '';
  document.getElementById('f-description').value        = currentIssue.description || '';
  document.getElementById('f-resolution-summary').value = currentIssue.resolutionSummary || '';
  document.getElementById('f-identified-by').value      = currentIssue.identifiedBy || '';
  document.getElementById('f-assigned-to').value        = currentIssue.assignedTo || '';
  document.getElementById('f-project').value            = currentIssue.project || '';
  document.getElementById('f-date-identified').value    = currentIssue.dateIdentified || '';
  document.getElementById('f-target-date').value        = currentIssue.targetDate || '';
  document.getElementById('f-actual-date').value        = currentIssue.actualDate || '';

  selectBadge('status',   currentIssue.status   || 'open');
  selectBadge('priority', currentIssue.priority || 'medium');

  document.getElementById('ticket-id-badge').textContent = `#${id}`;
  document.getElementById('ticket-id-badge').style.display = 'inline-block';
  document.getElementById('edit-form').classList.add('visible');
  document.getElementById('edit-form').scrollIntoView({ behavior:'smooth', block:'start' });
}

// ─── Badge selection ──────────────────────────────────
function selectBadge(type, val) {
  const rowId = type === 'status' ? 'status-row' : 'priority-row';
  document.querySelectorAll(`#${rowId} .badge-opt`).forEach(btn => {
    btn.className = 'badge-opt';
    if (btn.dataset.val === val) btn.classList.add(`selected-${val}`);
  });
  if (type === 'status')   selectedStatus   = val;
  if (type === 'priority') selectedPriority = val;
}

// ─── Save ─────────────────────────────────────────────
function saveIssue() {
  if (!currentIssue) return;

  const summary = document.getElementById('f-summary').value.trim();
  if (!summary) {
    document.getElementById('f-summary').focus();
    document.getElementById('f-summary').style.borderColor = 'var(--red)';
    setTimeout(() => document.getElementById('f-summary').style.borderColor = '', 2000);
    return;
  }

  const issues = getAll(KEYS.issues);
  const idx = issues.findIndex(i => i.id === currentIssue.id);
  if (idx === -1) return;

  issues[idx] = {
    ...issues[idx],
    summary:           summary,
    description:       document.getElementById('f-description').value.trim(),
    resolutionSummary: document.getElementById('f-resolution-summary').value.trim(),
    identifiedBy:      document.getElementById('f-identified-by').value,
    assignedTo:        document.getElementById('f-assigned-to').value,
    project:           document.getElementById('f-project').value,
    status:            selectedStatus,
    priority:          selectedPriority,
    dateIdentified:    document.getElementById('f-date-identified').value,
    targetDate:        document.getElementById('f-target-date').value,
    actualDate:        document.getElementById('f-actual-date').value,
  };

  saveAll(KEYS.issues, issues);
  showToast('✓ Issue saved successfully');
  populateIssueSelect();
}

function cancelEdit() {
  document.getElementById('edit-form').classList.remove('visible');
  document.getElementById('issue-select').value = '';
  document.getElementById('ticket-id-badge').style.display = 'none';
  currentIssue = null;
}

// ─── Toast ────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ─── Run ──────────────────────────────────────────────
init();
