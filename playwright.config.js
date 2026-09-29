import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./model-viewer/browser",
  timeout: 180000,
  workers: 1,
  use: {
    baseURL:
      process.env.VIEWER_URL ||
      "http://127.0.0.1:5173/ai-skills-blender-model-viewer/",
    channel: "chrome",
    viewport: { width: 1440, height: 900 },
    screenshot: "only-on-failure",
  },
  webServer: process.env.VIEWER_URL
    ? undefined
    : {
        command: "npm run dev -- --host 127.0.0.1",
        url: "http://127.0.0.1:5173/ai-skills-blender-model-viewer/",
        reuseExistingServer: !process.env.CI,
      },
});
