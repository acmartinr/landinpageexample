require("dotenv").config();

const fs = require("fs");
const http = require("http");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(error.code === "ENOENT" ? 404 : 500, {
        "Content-Type": "text/plain; charset=utf-8"
      });
      res.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream"
    });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  const requestedPath = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.normalize(path.join(PUBLIC_DIR, requestedPath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  sendFile(res, filePath);
});

server.listen(PORT, () => {
  console.log(`Landing page running at http://localhost:${PORT}`);
});
