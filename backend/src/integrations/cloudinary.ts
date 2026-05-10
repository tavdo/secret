import { v2 as cloudinary } from "cloudinary";
import { Readable } from "node:stream";
import { env } from "../config/env.js";

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
  );
}

export function configureCloudinary(): void {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadImageBuffer(folder: string, buffer: Buffer, filename: string) {
  if (!isCloudinaryConfigured()) {
    throw new Error("CLOUDINARY_NOT_CONFIGURED");
  }

  const uploaded = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const uploader = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        public_id: filename,
        overwrite: true,
      },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error("Upload failed"));
        resolve(result as { secure_url: string; public_id: string });
      }
    );

    Readable.from(buffer).pipe(uploader);
  });

  return { url: uploaded.secure_url, publicId: uploaded.public_id };
}
