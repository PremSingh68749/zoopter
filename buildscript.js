const { execSync } = require("child_process");
const fs = require("fs-extra");
const path = require("path");

const frontendPath = path.join(__dirname, "frontend");
const backendPath = path.join(__dirname, "backend");
const distSource = path.join(frontendPath, "dist");
const distDestination = path.join(backendPath, "dist");

try {
  console.log(" Running build in frontend...");
  execSync("npm run build", { cwd: frontendPath, stdio: "inherit" });

  console.log(" Removing old dist in backend (if any)...");
  fs.removeSync(distDestination);

  console.log(" Copying new dist to backend...");
  fs.copySync(distSource, distDestination);

  console.log("Build and copy completed successfully.");
} catch (error) {
  console.error(" Error during build-and-copy:", error.message);
  process.exit(1);
}
