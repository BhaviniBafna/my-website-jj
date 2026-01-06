/* ================================
   TEACHER DASHBOARD CONFIG
   ================================ */

// 👉 PASTE YOUR GOOGLE FORM PREFILL LINKS BELOW

// Class Report Form (single class submission)
const CLASS_REPORT_PREFILL_URL = "https://docs.google.com/forms/d/e/1FAIpQLSedIBTUPJMzgTQ7qSuk4q2UkrgGjFEMHDTNi7z246f1QnS3fQ/viewform?usp=pp_url&entry.1625050071=Abc&entry.1237932364=pqr&entry.65324203=2026-01-01&entry.682520019=6:00+AM+%E2%80%93+7:00+AM&entry.2077924797=Demo&entry.1720605895=Present&entry.440836205=Full&entry.1134532439=1&entry.92675400=Math+Around+Us&entry.996840583=Kid+enjoyed+the+session,+and+parents+were+willing+to+continue+regular+classes";

// Cancel / Leave Request Form (can include multiple slots)
const CANCEL_LEAVE_PREFILL_URL = "https://docs.google.com/forms/d/e/1FAIpQLSd8CfjpYZo9GWoeXw01H0mOzfp0ytrybHg3ir0JbuiO88P5_w/viewform?usp=pp_url&entry.1625050071=Ms.+Abc&entry.1237932364=pqr&entry.65324203=2026-01-07&entry.682520019=5:30+AM+%E2%80%93+6:30+AM&entry.682520019=6:00+AM+%E2%80%93+7:00+AM&entry.2077924797=Regular&entry.1720605895=Cancel+Class+(single+day)&entry.440836205=I+am+unavailable&entry.1134532439=yes&entry.92675400=3&entry.996840583=0";

/* ================================
   STATE (do not edit yet)
   ================================ */

let TEACHER_DATA = null;
let CURRENT_TEACHER = null;



/* ================================
   LOGIN LOGIC
   ================================ */

const $ = (id) => document.getElementById(id);

// Load teachers.json
async function loadTeachers() {
  const res = await fetch("./data/teachers.json", { cache: "no-store" });
  if (!res.ok) {
    alert("Unable to load teacher data.");
    return null;
  }
  return await res.json();
}

// Handle login
async function handleLogin() {
  const code = $("codeInput").value.trim();
  if (!code) return;

  TEACHER_DATA = await loadTeachers();
  if (!TEACHER_DATA) return;

  const teacher = TEACHER_DATA.teachers.find(t => t.code === code);

  if (!teacher) {
    $("loginErr").style.display = "block";
    return;
  }

  // Success
  CURRENT_TEACHER = teacher;

  $("loginErr").style.display = "none";
  $("loginScreen").style.display = "none";
  $("app").style.display = "block";

  // Show teacher info
  $("teacherTitle").textContent = `Welcome, ${teacher.name}`;
  $("teacherMeta").textContent = `Students: ${teacher.students.join(", ") || "None assigned"}`;

  // Save session (so refresh doesn’t log out)
  sessionStorage.setItem("teacherLoggedIn", teacher.id);
}

// Restore session if already logged in
async function restoreSession() {
  const savedId = sessionStorage.getItem("teacherLoggedIn");
  if (!savedId) return;

  TEACHER_DATA = await loadTeachers();
  if (!TEACHER_DATA) return;

  const teacher = TEACHER_DATA.teachers.find(t => t.id === savedId);
  if (!teacher) return;

  CURRENT_TEACHER = teacher;

  $("loginScreen").style.display = "none";
  $("app").style.display = "block";
  $("teacherTitle").textContent = `Welcome, ${teacher.name}`;
  $("teacherMeta").textContent = `Students: ${teacher.students.join(", ") || "None assigned"}`;
}

// Logout
function handleLogout() {
  sessionStorage.removeItem("teacherLoggedIn");
  location.reload();
}

// Wire events
document.addEventListener("DOMContentLoaded", () => {
  $("btnLogin").addEventListener("click", handleLogin);
  $("codeInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleLogin();
  });
  $("btnLogout").addEventListener("click", handleLogout);
  restoreSession();
});

