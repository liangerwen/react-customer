import { createServer } from "node:http";
import { join, extname } from "node:path";
import { readFile } from "node:fs";
import { RsbuildPluginAPI } from "@rsbuild/core";

let server: ReturnType<typeof createServer>;

function getContentType(filePath: string) {
  const extMap = {
    ".js": "text/javascript",
    ".css": "text/css",
    ".html": "text/html",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".gif": "image/gif",
  };
  return (
    extMap[extname(filePath) as keyof typeof extMap] ??
    "application/octet-stream"
  );
}

const servePlugin = ({ target = "dist", port = 8080 } = {}) => {
  return {
    name: "serve-plugin",
    setup: (api: RsbuildPluginAPI) => {
      api.onAfterBuild(() => {
        if (server) {
          server.close();
        }
        server = createServer((req, res) => {
          let filePath = join(
            join(process.cwd(), target),
            req.url === "/" ? "index.html" : req.url!
          );
          readFile(filePath, (err, content) => {
            if (err) {
              res.writeHead(404);
              res.end("404 Not Found");
            } else {
              res.writeHead(200, { "Content-Type": getContentType(filePath) });
              res.end(content);
            }
          });
        });
        server.listen(port, () => {
          console.log(`Server is running at http://localhost:${port}`);
        });
      });
    },
  };
};

export default servePlugin;
