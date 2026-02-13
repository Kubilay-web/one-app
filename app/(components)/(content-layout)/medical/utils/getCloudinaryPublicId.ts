export function getCloudinaryPublicId(url: string) {
  if (!url) return null;

  const parts = url.split("/");
  const filename = parts[parts.length - 1]; // jz95gqq6hndxlk1qszdu.jpg
  const publicId = filename.split(".")[0]; // jz95gqq6hndxlk1qszdu

  return publicId;
}
