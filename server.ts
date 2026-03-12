import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { scrapeEntreRios } from "./src/scraper";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/auctions", async (req, res) => {
    try {
      console.log("Iniciando scraping de Entre Ríos...");
      const data = await scrapeEntreRios();
      res.json({ success: true, count: data.length, data });
    } catch (error) {
      console.error("Error en el scraping:", error);
      res.status(500).json({ success: false, error: "Error al realizar el scraping" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
