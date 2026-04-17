import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { clearTodos } from "./helpers";

test("has no critical accessibility violations on the main view", async ({ page, request, baseURL }) => {
  await clearTodos(request, baseURL!);

  await request.post(`${baseURL}/api/todos`, {
    data: {
      text: "Run the accessibility audit"
    }
  });

  await page.goto("/");

  const results = await new AxeBuilder({ page }).analyze();
  const criticalViolations = results.violations.filter((violation) => violation.impact === "critical");

  expect(criticalViolations).toEqual([]);
});
