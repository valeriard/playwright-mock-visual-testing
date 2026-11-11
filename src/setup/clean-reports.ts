import { rmSync } from 'node:fs';

/** Runs once before each execution so reports never mix results from previous runs. */
const REPORT_DIRS = ['allure-results', 'allure-report'];

export default async function globalSetup(): Promise<void> {
  for (const dir of REPORT_DIRS) {
    rmSync(dir, { recursive: true, force: true });
  }
}
