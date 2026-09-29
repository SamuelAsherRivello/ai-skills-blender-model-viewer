import { readdir, readFile } from "node:fs/promises";
import { resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
export async function inspect(root) {
  const problems = [];
  async function walk(dir) {
    for (const item of await readdir(dir, { withFileTypes: true })) {
      if (
        [
          ".git",
          "node_modules",
          ".local",
          "test-results",
          "playwright-report",
        ].includes(item.name)
      )
        continue;
      const path = resolve(dir, item.name);
      if (item.isDirectory()) {
        await walk(path);
        continue;
      }
      if (
        /\.(blend\d*|glb|gltf|fbx|obj|stl|ply|usdz|babylon)$/i.test(item.name)
      )
        problems.push("Model binary: " + relative(root, path));
      if (/\.(js|jsx|json|html|yml|yaml|env|txt)$/i.test(item.name)) {
        const text = await readFile(path, "utf8");
        if (
          /gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}/.test(text)
        )
          problems.push("Credential: " + relative(root, path));
      }
    }
  }
  await walk(resolve(root));
  return problems;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const errors = await inspect(process.argv[2] || ".");
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  } else
    console.log(
      "Distribution check passed: no model files or GitHub credentials.",
    );
}
