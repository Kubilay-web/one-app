import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { AppFileRouter } from "../api/uploadthing/core";

// UploadButton için özel endpoint
export const UploadButton = generateUploadButton<AppFileRouter>({
  endpoint: "uploadthing", // burası API route ismi
});

// UploadDropzone için özel endpoint
export const UploadDropzone = generateUploadDropzone<AppFileRouter>({
  endpoint: "uploadthing",
});
