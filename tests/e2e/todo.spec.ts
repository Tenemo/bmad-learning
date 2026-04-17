import { expect, test } from "@playwright/test";

import { clearTodos } from "./helpers";

test.beforeEach(async ({ page, request, baseURL }) => {
  await clearTodos(request, baseURL!);
  await page.goto("/");
});

test("shows the empty state when there are no todos", async ({ page }) => {
  await expect(page.getByText("Your list is clear.")).toBeVisible();
});

test("creates a todo and keeps it after reload", async ({ page }) => {
  await page.getByLabel("Add a task").fill("Prepare the submission package");
  await page.getByRole("button", { name: "Add todo" }).click();

  await expect(page.getByText("Prepare the submission package")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Prepare the submission package")).toBeVisible();
});

test("marks a todo as complete", async ({ page }) => {
  await page.getByLabel("Add a task").fill("Verify the health endpoint");
  await page.getByRole("button", { name: "Add todo" }).click();

  await page.getByLabel('Mark "Verify the health endpoint" as complete').click();
  await expect(page.getByLabel('Mark "Verify the health endpoint" as active')).toBeChecked();
});

test("deletes a todo", async ({ page }) => {
  await page.getByLabel("Add a task").fill("Remove this task");
  await page.getByRole("button", { name: "Add todo" }).click();

  await page.getByRole("button", { name: 'Delete "Remove this task"' }).click();
  await expect(page.getByText("Your list is clear.")).toBeVisible();
});

test("shows a user-visible error when the backend read fails", async ({ page }) => {
  await page.route("**/api/todos", async (route, request) => {
    if (request.method() === "GET") {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Backend unavailable" })
      });
      return;
    }

    await route.fallback();
  });

  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText("Could not load your todos. Please retry.");
});
