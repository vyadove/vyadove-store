// rename-fonts.js
import fs from "fs";
import path from "path";

const folder = "./sofia-pro-az"; // adjust if needed

const files = fs.readdirSync(folder);

files.forEach((file) => {
  const oldPath = path.join(folder, file);

  // Skip if not a font file
  if (!file.endsWith(".woff")) return;

  // Remove spaces and the trailing "Az" before extension
  const newName = file
    .replace(/\s+/g, "") // remove all spaces
    .replace(/Az(?=\.woff)/, ""); // remove 'Az' right before .woff

  const newPath = path.join(folder, newName);

  fs.renameSync(oldPath, newPath);
  console.log(`✅ ${file} → ${newName}`);
});

console.log("🎉 All font files renamed!");
