import fs from "fs";
import { join } from "path";

const srcDir = "src";
const staticDir = "static";
const buildDir = "dist";

// if (!fs.existsSync(buildDir)) {
//     fs.mkdirSync(buildDir);
// }

fs.cpSync(staticDir, buildDir, { recursive: true });
["index.html", "redirect.html"]
    .forEach(file => fs.copyFileSync(file, join(buildDir, file)));