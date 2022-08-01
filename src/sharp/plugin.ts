//@ts-nocheck

import path from "path";
import { promises as fs } from "fs";

export default function sharp() {
   return {
     name: "sharpPlugin",
 
     configureServer(server) {
       server.middlewares.use(async (req, res, next) => {
         if (req.url.startsWith("/@") || req.url.startsWith("/src") || req.url.startsWith("/node")) {
           return next();
         }
 
         const { renderInNode } = await server.ssrLoadModule(
           path.resolve(__dirname, "./serverEntry.tsx")
         );
 
         const indexHtml = await fs.readFile(
           path.resolve(__dirname, "../../index.html"),
           "utf-8"
         );
 
         const url = new URL("http://localhost:3000/" + req.url);
 
         const template = await server.transformIndexHtml(
           url.toString(),
           indexHtml
         );
 
         const head = template.match(/<head>(.+?)<\/head>/s)[1];
 
         return renderInNode({ res, req, head });
       });
     },
   };
 }