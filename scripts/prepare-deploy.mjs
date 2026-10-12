import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const outputDirectory = "public";
const html = readFileSync("index.html", "utf8");
const stylesheetPath = `${outputDirectory}/src/style/style.css`;

mkdirSync(dirname(stylesheetPath), { recursive: true });
mkdirSync(`${outputDirectory}/dist`, { recursive: true });
writeFileSync(`${outputDirectory}/index.html`, html);
cpSync("src/style/style.css", stylesheetPath);
cpSync("dist", `${outputDirectory}/dist`, { recursive: true });
