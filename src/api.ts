const DEFAULT_ENDPOINT = "http://localhost:3000";
const API_ENDPOINT = import.meta.env?.VITE_SERVER_URL || DEFAULT_ENDPOINT;

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(API_ENDPOINT + "/trace", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const message = await extractError(response);
    throw new Error(message);
  }

  return response.text();
}

async function extractError(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    try {
      const data = await response.json();
      return data.error || "Conversion failed";
    } catch (err) {
      return "Conversion failed";
    }
  }
  return "Conversion failed";
}
