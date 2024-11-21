/**
 * Converts a File or Blob object to a base64 string
 * @param file - The File or Blob to convert
 * @returns Promise that resolves with the base64 string
 */
export const fileToBase64 = async (file: File | Blob): Promise<string> => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return buffer.toString("base64");
};
