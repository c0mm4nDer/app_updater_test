import { bare } from "@hot-updater/bare";
import { defineConfig } from "hot-updater";
import { standaloneRepository } from "@hot-updater/standalone";
import { s3Storage } from "@hot-updater/aws";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load optional .env.hotupdater file for local development
config({ path: path.join(__dirname, ".env.hotupdater") });

console.log({ AWS_REGION: process.env.AWS_REGION })
const region = process.env.AWS_REGION || "us-east-1";
const endpoint = process.env.AWS_S3_ENDPOINT || "http://localhost:4566";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "test";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "test";
const bundlesBucket =
    process.env.AWS_S3_BUNDLES_BUCKET || "hot-updater-bundles";

config({ path: ".env.hotupdater" });


export default defineConfig({
    build: bare({ enableHermes: true }),
    storage: s3Storage({
        region,
        endpoint,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
        bucketName: bundlesBucket,

    }),
    database: standaloneRepository({
        baseUrl: "http://localhost:3000/hot-updater",
    }),
    updateStrategy: "appVersion", // or "fingerprint"
});