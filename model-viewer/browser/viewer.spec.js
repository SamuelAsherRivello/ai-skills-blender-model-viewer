import { test, expect } from "@playwright/test";
const source = "SamuelAsherRivello/ai-skills-blender";
const raw = "https://raw.githubusercontent.com/" + source + "/";
const ref = "https://api.github.com/repos/" + source + "/git/ref/heads/main";
const ready = (page) =>
  expect(
    page.getByRole("button", { name: "Reset view", exact: true }),
  ).toBeEnabled({ timeout: 150000 });
test("every public model renders at one revision with correct metadata", async ({
  page,
  request,
}) => {
  test.setTimeout(600000);
  const revision = (await (await request.get(ref)).json()).object.sha;
  const catalog = await (
    await request.get(raw + revision + "/documentation/models/index.json")
  ).json();
  const tree = await (
    await request.get(
      `https://api.github.com/repos/${source}/git/trees/${revision}?recursive=1`,
    )
  ).json();
  expect(tree.truncated).toBe(false);
  expect(catalog.models.map((m) => m.sourcePath).sort()).toEqual(
    tree.tree
      .filter((e) => e.path.endsWith(".blend"))
      .map((e) => e.path)
      .sort(),
  );
  // Pin discovery only; all catalog and model bytes still come from public HTTP.
  await page.route(ref, (r) =>
    r.fulfill({ json: { object: { sha: revision } } }),
  );
  const modelRequests = [],
    errors = [];
  page.on("request", (r) => {
    if (r.url().endsWith(".glb")) modelRequests.push(r.url());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./");
  await expect(
    page.getByRole("button", { name: "Back", exact: true }),
  ).toBeDisabled();
  for (let i = 0; i < catalog.models.length; i++) {
    const m = catalog.models[i];
    await expect(
      page.getByRole("heading", { name: m.title, exact: true }),
    ).toBeVisible();
    await ready(page);
    await expect(page.locator(".path-block code")).toHaveText(m.sourcePath);
    if ((await page.locator("details").getAttribute("open")) === null)
      await page.locator("summary").click();
    await expect(page.locator("details")).toHaveAttribute("open", "");
    expect(await page.locator(".stats").innerText()).toContain("triangles");
    if (m.exported.animations.length) {
      const frame = await page.locator("canvas").screenshot();
      await page.waitForTimeout(350);
      expect((await page.locator("canvas").screenshot()).equals(frame)).toBe(
        false,
      );
      await expect(
        page.getByRole("button", { name: "Pause", exact: true }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Pause", exact: true }).click();
      await expect(
        page.getByRole("button", { name: "Play", exact: true }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Play", exact: true }).click();
    }
    await page.screenshot({
      path: `test-results/public-${String(i + 1).padStart(2, "0")}.png`,
    });
    if (i < catalog.models.length - 1)
      await page.getByRole("button", { name: "Next", exact: true }).click();
  }
  await expect(
    page.getByRole("button", { name: "Next", exact: true }),
  ).toBeDisabled();
  expect(modelRequests).toHaveLength(catalog.models.length);
  expect(
    modelRequests.every((url) => url.startsWith(raw + revision + "/")),
  ).toBe(true);
  expect(errors).toEqual([]);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole("button", { name: "Back", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "test-results/mobile.png" });
});

test("asset failure, retry, rapid navigation, and keyboard controls", async ({
  page,
  request,
}) => {
  const revision = (await (await request.get(ref)).json()).object.sha;
  const catalog = await (
    await request.get(raw + revision + "/documentation/models/index.json")
  ).json();
  const models = catalog.models.slice(0, 3);
  models[0].metadata = [
    {
      label: "Untrusted text",
      value: '<img src=x onerror="window.injected=true">',
      provenancePath: "README.md",
    },
  ];
  await page.route(ref, (r) =>
    r.fulfill({ json: { object: { sha: revision } } }),
  );
  await page.route(raw + revision + "/documentation/models/index.json", (r) =>
    r.fulfill({ json: { schemaVersion: 1, models } }),
  );
  let failed = true;
  await page.route(raw + revision + "/" + models[0].glbPath, (r) =>
    failed
      ? r.fulfill({ status: 503, body: "Temporary failure" })
      : r.continue(),
  );
  await page.goto("./");
  await expect(
    page.getByRole("button", { name: "Retry model", exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => window.injected)).toBeUndefined();
  failed = false;
  await page.getByRole("button", { name: "Retry model", exact: true }).click();
  await ready(page);
  await page.getByRole("button", { name: "Next", exact: true }).focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: models[2].title, exact: true }),
  ).toBeVisible();
  await ready(page);
  await expect(page.locator(".path-block code")).toHaveText(
    models[2].sourcePath,
  );
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await ready(page);
  await expect(page.locator(".path-block code")).toHaveText(
    models[1].sourcePath,
  );
});

test("catalog errors and empty collection have usable retry states", async ({
  page,
}) => {
  let state = "error";
  await page.route(ref, (r) =>
    state === "error"
      ? r.fulfill({ status: 429, body: "Limit" })
      : r.fulfill({ json: { object: { sha: "a".repeat(40) } } }),
  );
  await page.route(raw + "**/documentation/models/index.json", (r) =>
    r.fulfill({ json: { schemaVersion: 1, models: [] } }),
  );
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: "Collection unavailable" }),
  ).toBeVisible();
  state = "empty";
  await page.getByRole("button", { name: "Retry collection" }).click();
  await expect(
    page.getByRole("heading", { name: "No models yet" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Next", exact: true }),
  ).toBeDisabled();
});
