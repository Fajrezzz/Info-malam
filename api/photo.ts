export type Photo = {
  public_id: string;
  format: string;
  version: number;
  width?: number;
  height?: number;
};

export const CLOUD_NAME = "dxkbvpaa1";
export const TAG = "teman";

export const getPhotoUrl = (photo: Photo) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${photo.public_id}.${photo.format}`;
