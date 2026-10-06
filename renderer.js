const themeToggle = document.getElementById("themeToggle");
const folderBtn = document.getElementById("folderBtn");

async function loadSystemInfo() {
  const info = await window.dashboardAPI.getInfo();

  document.getElementById("app-name").textContent = info.name;
  document.getElementById("app-version").textContent = info.version;
  document.getElementById("app-platform").textContent = info.platform;
  document.getElementById("app-arch").textContent = info.arch;
  document.getElementById("app-user-data").textContent = info.userDataPath;
}

themeToggle.addEventListener("click", async () => {
  const currentTheme = document.body.dataset.theme === "dark" ? "dark" : "light";
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  document.body.dataset.theme = nextTheme;

  const result = await window.dashboardAPI.toggleTheme(nextTheme);
  console.log("Theme changed:", result);
});

folderBtn.addEventListener("click", async () => {
  const paths = await window.dashboardAPI.openFolder();

  if (paths.length === 0) {
    console.log("User cancelled folder selection.");
    return;
  }

  console.log("Selected folders:", paths);
});

window.dashboardAPI.onThemeChanged((theme) => {
  document.body.dataset.theme = theme;
});

loadSystemInfo().catch((err) => {
  console.error("Failed to load system info:", err);
});
