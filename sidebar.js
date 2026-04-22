document.addEventListener("DOMContentLoaded", () => {
  const burger = document.getElementById("toggle-btn");
  const sidebar = document.getElementById("sidebar");

  if (burger && sidebar) {
    burger.addEventListener("click", () => {
      sidebar.classList.toggle("expanded");
      console.log(
        "Sidebar status: ",
        sidebar.classList.contains("expanded") ? "Expanded" : "Collapsed",
      );
    });
  } else {
    console.error(
      "Missing ID: Make sure your nav has id='sidebar' and your burger has id='toggle-btn'",
    );
  }
});
