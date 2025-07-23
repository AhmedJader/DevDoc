// extension/esbuild.js

const { build } = require("esbuild");

async function run() {
  const isWatchMode = process.argv.includes("--watch");

  // Load the correct .env file based on NODE_ENV
  if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: "../.env.local" });
  } else {
    require("dotenv").config({ path: "../.env" });
  }

  // Define the variables to be replaced during the build
  const define = {
    "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
    "process.env.API_URL_PROD": `"${process.env.API_URL_PROD}"`,
    "process.env.API_URL_DEV": `"${process.env.API_URL_DEV}"`,
  };

  // --- Start of Corrected Logic ---

  // Create the base options for esbuild
  const options = {
    entryPoints: ["./extension.ts"],
    bundle: true,
    outfile: "./out/extension.js",
    external: ["vscode"],
    format: "cjs",
    platform: "node",
    sourcemap: process.env.NODE_ENV !== "production",
    define: define,
  };

  // Only add the 'watch' property if we are in watch mode
  if (isWatchMode) {
    options.watch = {
      onRebuild(error, result) {
        if (error) console.error("Watch build failed:", error);
        else console.log("Watch build succeeded.");
      },
    };
  }

  // --- End of Corrected Logic ---

  try {
    await build(options);
    if (!isWatchMode) {
      console.log("Build successful!");
    }
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

run();
