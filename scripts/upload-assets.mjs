import { createClient } from "@supabase/supabase-js";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const BUCKET = "event-assets";
const ROOT = "src/assets";

const mime = (n) => {
  if (n.endsWith(".jpg") || n.endsWith(".jpeg")) return "image/jpeg";
  if (n.endsWith(".png")) return "image/png";
  if (n.endsWith(".webp")) return "image/webp";
  if (n.endsWith(".lottie")) return "application/zip";
  return "application/octet-stream";
};

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const files = await walk(ROOT);
const urls = {};
for (const f of files) {
  const rel = f.slice(ROOT.length + 1); // e.g. hotels/h1-1.jpg
  const buf = await readFile(f);
  const { error } = await sb.storage.from(BUCKET).upload(`mock/${rel}`, buf, {
    contentType: mime(f),
    upsert: true,
  });
  if (error) {
    console.error("FAIL", rel, error.message);
    continue;
  }
  const { data } = sb.storage.from(BUCKET).getPublicUrl(`mock/${rel}`);
  urls[rel] = data.publicUrl;
  console.log("OK", rel);
}
await readFile("/tmp/asset-urls.json").catch(() => null);
const fs = await import("node:fs/promises");
await fs.writeFile("/tmp/asset-urls.json", JSON.stringify(urls, null, 2));
console.log("Wrote", Object.keys(urls).length, "URLs");
