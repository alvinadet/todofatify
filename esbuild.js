const env = process.argv[2]
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const fs = require("fs")
const path = require("path")
const esbuild = require("esbuild")
const { copy } = require("esbuild-plugin-copy")

let fileArray = []
const getFilesRecursively = (dir) => {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      getFilesRecursively(filePath)
    } else {
      fileArray.push(filePath)
    }
  })
}
getFilesRecursively("src")

const entryPoints = fileArray.filter((file) => file.endsWith(".ts"))

esbuild.build({
  entryPoints,
  minify: true,
  logLevel: "info",
  outdir: env === "dev" ? "dist" : "build",
  platform: "node",
  format: "cjs",
  mainFields: ["module", "main"],
  tsconfig: "./tsconfig.json",
  plugins: [
    copy({ assets: { from: "./package.json", to: "./package.json" } }),
    copy({ assets: { from: "./migrations/*", to: "./migrations" } }),
    copy({ assets: { from: "./ormconfig.ts", to: "./ormconfig.ts" } }),
  ],
})
