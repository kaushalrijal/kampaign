// Centralized client-side API helpers for fetch calls.

export interface SMTPTestResponse {
  success: boolean;
  message?: string;
}


export interface SendCampaignResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function testSMTPConnection(): Promise<SMTPTestResponse> {
  const res = await fetch("/api/smtp/test");
  return handleResponse<SMTPTestResponse>(res);
}

export async function sendCampaign(
  formData: FormData
): Promise<SendCampaignResponse> {
  const res = await fetch("/api/send", {
    method: "POST",
    body: formData
  });

  return handleResponse<SendCampaignResponse>(res);
}
