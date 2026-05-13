import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const urls = JSON.parse(await readFile("/tmp/asset-urls.json", "utf8"));
const u = (k) => urls[k];

const EID = "bd31df31-3042-484e-b8f4-5909604c598e";

async function run(label, fn) {
  try {
    await fn();
    console.log("✓", label);
  } catch (e) {
    console.error("✗", label, e.message);
  }
}

// Event logo + cover + theme defaults
await run("event logo/cover", () =>
  sb.from("events").update({
    logo_url: u("asf-logo.png"),
    cover_url: u("overview-hanoi.jpg"),
    theme: { primary: "#C8A45D", accent: "#1A1F2E", animations: { signup: u("signup.lottie"), call: u("call-ringing.lottie"), faq: u("faq-chatbot.lottie") } },
  }).eq("id", EID).then(({ error }) => { if (error) throw error; })
);

await run("hero background", () =>
  sb.from("hero_content").update({ background_url: u("overview-hanoi.jpg") }).eq("event_id", EID).then(({ error }) => { if (error) throw error; })
);

// Speakers — order by position then assign s1..s8
const { data: speakers } = await sb.from("speakers").select("id, position").eq("event_id", EID).order("position");
for (let i = 0; i < (speakers ?? []).length; i++) {
  const url = u(`speakers/s${i + 1}.jpg`);
  if (!url) continue;
  await run(`speaker[${i}]`, () =>
    sb.from("speakers").update({ avatar_url: url }).eq("id", speakers[i].id).then(({ error }) => { if (error) throw error; })
  );
}

// Topics by slug
const topicMap = {
  "asian-equity-outlook": u("topics/t1.jpg"),
  "asian-bond-markets": u("topics/t2.jpg"),
  "digital-ai-capital-markets": u("topics/t3.jpg"),
  "vietnam-new-era": u("topics/t4.jpg"),
};
for (const [slug, url] of Object.entries(topicMap)) {
  await run(`topic ${slug}`, () =>
    sb.from("topics").update({ image_url: url }).eq("event_id", EID).eq("slug", slug).then(({ error }) => { if (error) throw error; })
  );
}

// Hotels by name → images array
const hotelMap = {
  "Meliá Hanoi": [u("hotels/h1-1.jpg"), u("hotels/h1-2.jpg"), u("hotels/h1-3.jpg")],
  "InterContinental Hanoi Landmark 72": [u("hotels/h2-1.jpg"), u("hotels/h2-2.jpg"), u("hotels/h2-3.jpg")],
  "Sheraton Hanoi Hotel": [u("hotels/h3-1.jpg"), u("hotels/h3-2.jpg")],
};
for (const [name, images] of Object.entries(hotelMap)) {
  await run(`hotel ${name}`, () =>
    sb.from("hotels").update({ images }).eq("event_id", EID).eq("name", name).then(({ error }) => { if (error) throw error; })
  );
}

// News by slug → cover
const newsMap = {
  "asf-2026-programme-released": u("news/n1.jpg"),
  "vietnam-investment-conference-joins-asf": u("news/n2.jpg"),
  "asia-sustainable-bond-market-milestone": u("news/n3.jpg"),
};
for (const [slug, cover_url] of Object.entries(newsMap)) {
  await run(`news ${slug}`, () =>
    sb.from("news").update({ cover_url }).eq("event_id", EID).eq("slug", slug).then(({ error }) => { if (error) throw error; })
  );
}

// VBMA logo into footer-ish: store in event_settings.contact (or seo) as organizer logo
await run("event_settings organizer logo", () =>
  sb.from("event_settings").update({
    seo: { organizer_logo: u("vbma-logo.png") },
  }).eq("event_id", EID).then(({ error }) => { if (error) throw error; })
);

console.log("Done.");
