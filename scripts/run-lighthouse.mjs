import { mkdir, rm, writeFile } from "node:fs/promises";
import { once } from "node:events";
import { join } from "node:path";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const outputDir = join(process.cwd(), "docs", "qa");
const profileDir = join(outputDir, ".lighthouse-profile");

await mkdir(outputDir, { recursive: true });
await rm(profileDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
await mkdir(profileDir, { recursive: true });

const chrome = await chromeLauncher.launch({
  userDataDir: profileDir,
  chromeFlags: ["--headless=new", "--disable-gpu", "--no-sandbox"]
});

try {
  const result = await lighthouse("http://127.0.0.1:4173", {
    output: "json",
    onlyCategories: ["performance", "accessibility", "best-practices"],
    logLevel: "error",
    port: chrome.port,
    preset: "desktop"
  });

  if (!result?.report) {
    throw new Error("Lighthouse did not produce a report.");
  }

  const reportPath = join(outputDir, "lighthouse-report.json");
  await writeFile(reportPath, result.report, "utf8");

  console.log(`Lighthouse report written to ${reportPath}`);
} finally {
  const chromeProcess = chrome.process;
  chrome.kill();

  if (chromeProcess && chromeProcess.exitCode === null) {
    await once(chromeProcess, "close");
  }

  await rm(profileDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
}
