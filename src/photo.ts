export type Photo = {
  public_id: string;
  url: string;
};

const CLOUD_NAME = "dxkbvpaa1";

export const photos: Photo[] = [
  ...Array.from({ length: 15 }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");

    return {
      public_id: `teman-${n}`,
      url: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/teman-${n}`,
    };
  }),

  ...Array.from({ length: 14 }, (_, i) => {
    const n = String(i + 16);

    return {
      public_id: n,
      url: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${n}`,
    };
  }),
];
