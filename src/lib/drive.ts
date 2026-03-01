// Helper for uploading files to Google Drive using the same OAuth access token
// returned by the Classroom/Drive OAuth flow.

export async function uploadToDrive(
  accessToken: string,
  file: File
): Promise<{ id: string; title: string }> {
  // Build multipart form data according to Google Drive API docs
  const metadata = {
    name: file.name,
    mimeType: file.type || "application/octet-stream",
  };

  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  form.append("file", file);

  const res = await fetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Drive upload failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  return { id: data.id, title: data.name };
}
