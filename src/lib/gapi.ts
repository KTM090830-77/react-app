// gapi.ts 최종 수정본

declare global {
  interface Window {
    gapi: any;
  }
}

let gapiLoaded = false;

export function loadGapi(): Promise<void> {
  if (gapiLoaded) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src="https://apis.google.com/js/api.js"]');
    if (existing) {
      (existing as HTMLScriptElement).onload = () => {
        gapiLoaded = true;
        window.gapi.load('client:auth2', () => resolve());
      };
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      gapiLoaded = true;
      window.gapi.load('client:auth2', () => resolve());
    };
    script.onerror = (e) => reject(new Error('Failed to load gapi script'));
    document.body.appendChild(script);
  });
}

export async function initGapiClient(accessToken: string) {
  await loadGapi();
  if (!window.gapi.client || !window.gapi.client.drive || !window.gapi.client.classroom) {
    await window.gapi.client.init({
      apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      discoveryDocs: [
        'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
        'https://www.googleapis.com/discovery/v1/apis/classroom/v1/rest',
      ],
    });
  }
  window.gapi.auth.setToken({ access_token: accessToken });
}

export async function uploadFileWithGapi(file: File) {
  if (!window.gapi.client.drive) throw new Error("Google Drive API is not initialized.");

  const boundary = 'foo_bar_baz';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";
  const reader = new FileReader();

  return new Promise<{ id: string; title: string }>((resolve, reject) => {
    reader.readAsBinaryString(file);
    reader.onload = async () => {
      const contentType = file.type || 'application/octet-stream';
      const metadata = { name: file.name, mimeType: contentType };
      const multipartRequestBody =
        delimiter + 'Content-Type: application/json\r\n\r\n' + JSON.stringify(metadata) +
        delimiter + 'Content-Type: ' + contentType + '\r\n' + 'Content-Transfer-Encoding: base64\r\n\r\n' +
        btoa(reader.result as string) + close_delim;

      try {
        const response = await window.gapi.client.request({
          path: '/upload/drive/v3/files',
          method: 'POST',
          params: { uploadType: 'multipart' },
          headers: { 'Content-Type': 'multipart/mixed; boundary="' + boundary + '"' },
          body: multipartRequestBody,
        });
        resolve({ id: response.result.id, title: response.result.name });
      } catch (err) { reject(err); }
    };
    reader.onerror = (err) => reject(err);
  });
}

export async function addAttachmentsViaGapi(
  courseId: string,
  courseWorkId: string,
  submissionId: string,
  attachments: Array<any>
) {
  const token = window.gapi.auth.getToken()?.access_token;
  if (!token) throw new Error("GAPI token is missing");

  const body = {
    addAttachments: attachments.map(att => {
      // ID 추출 로직: 여러 계층 구조를 모두 대응합니다.
      let fileId = "";
      if (typeof att === 'string') fileId = att;
      else if (att.id) fileId = att.id;
      else if (att.driveFile?.driveFile?.id) fileId = att.driveFile.driveFile.id;
      else if (att.driveFile?.id) fileId = att.driveFile.id;

      if (!fileId) throw new Error("파일 ID를 찾을 수 없습니다.");

      return {
        driveFile: { id: fileId } // 서버가 수락한 최종 구조
      };
    })
  };

  const url = `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions/${submissionId}:modifyAttachments`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`첨부 실패: ${JSON.stringify(errorData.error)}`);
  }
  return await response.json();
}