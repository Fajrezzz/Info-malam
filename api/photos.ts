import type { VercelRequest, VercelResponse } from "@vercel/node";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const result = await cloudinary.search
      .expression("folder:teman AND resource_type:image")
      .sort_by("created_at", "desc")
      .max_results(500)
      .execute();

    const photos = result.resources.map((photo: any) => ({
      id: photo.public_id,
      url: photo.secure_url,
      width: photo.width,
      height: photo.height,
      createdAt: photo.created_at,
    }));

    return res.status(200).json({
      success: true,
      photos,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      photos: [],
      error: "Gagal mengambil foto dari Cloudinary",
    });
  }
}
