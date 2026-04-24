import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "x-client-info", "apikey"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Explicit OPTIONS handler for preflight
app.options("*", (c) => c.text("", 204));

// Error handler to ensure CORS headers even on crash
app.onError((err, c) => {
  console.error("Internal Server Error:", err);
  return c.json({ error: "Internal Server Error", details: err.message }, 500);
});

// Health check endpoint
app.get("/make-server-adc0d2a4/health", (c) => {
  return c.json({ status: "ok" });
});

// GET magazines from KV store
app.get("/make-server-adc0d2a4/api/magazines", async (c) => {
  try {
    let magazines = null;
    try {
      magazines = await kv.get("magazines:list");
    } catch (kvErr) {
      console.warn("Could not get magazines from KV, might be uninitialized:", kvErr);
    }
    
    // Seed the database if empty
    if (!magazines || !Array.isArray(magazines) || magazines.length === 0) {
      magazines = [
        {
          id: 1,
          title: { zh: "极简主义", en: "Minimalism" },
          description: { zh: "探索Apple工业设计背后的哲学与纯粹美学。", en: "Explore the philosophy and pure aesthetics behind Apple's industrial design." },
          image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1080",
          tags: ["设计", "极简", "美学"],
          category: "lifestyle",
          date: "2026-04-15"
        },
        {
          id: 2,
          title: { zh: "空间计算", en: "Spatial Computing" },
          description: { zh: "深入解析Vision Pro如何重塑我们与数字世界的交互方式。", en: "An in-depth analysis of how Vision Pro reshapes our interaction with the digital world." },
          image: "https://images.unsplash.com/photo-1622979135240-caa6648190b6?auto=format&fit=crop&q=80&w=1080",
          tags: ["科技", "前沿", "创新"],
          category: "technology",
          date: "2026-04-10"
        },
        {
          id: 3,
          title: { zh: "灵感视界", en: "Visionary Inspiration" },
          description: { zh: "全球顶尖创作者如何利用现代工具捕捉转瞬即逝的灵感。", en: "How top global creators use modern tools to capture fleeting inspiration." },
          image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=1080",
          tags: ["灵感", "创作", "摄影"],
          category: "fashion",
          date: "2026-04-05"
        },
        {
          id: 4,
          title: { zh: "建筑之韵", en: "Architectural Rhythm" },
          description: { zh: "从Apple Park看现代建筑设计中的自然共生与能源效率。", en: "Looking at natural symbiosis and energy efficiency in modern architectural design through Apple Park." },
          image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1080",
          tags: ["建筑", "环保", "设计"],
          category: "business",
          date: "2026-03-28"
        },
        {
          id: 5,
          title: { zh: "生活重塑", en: "Life Reshaped" },
          description: { zh: "科技无缝融入日常生活：构建智能、宁静的个人空间。", en: "Technology seamlessly integrated into daily life: building smart, tranquil personal spaces." },
          image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=1080",
          tags: ["生活", "智能", "空间"],
          category: "lifestyle",
          date: "2026-03-20"
        },
        {
          id: 6,
          title: { zh: "纯粹摄影", en: "Pure Photography" },
          description: { zh: "光影的艺术：如何用最简单的设备捕捉最具震撼力的瞬间。", en: "The art of light and shadow: capturing the most powerful moments with the simplest equipment." },
          image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=1080",
          tags: ["摄影", "艺术", "视觉"],
          category: "travel",
          date: "2026-03-12"
        }
      ];
      await kv.set("magazines:list", magazines);
    }
    
    return c.json({ data: magazines });
  } catch (err) {
    console.error("Error fetching magazines:", err);
    return c.json({ error: "Failed to fetch magazines", data: [] }, 500);
  }
});

Deno.serve(app.fetch);