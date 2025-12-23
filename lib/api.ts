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
    let message = `Request failed with status ${response.status}`;

    try {
      const data = await response.json();
      if (data?.message) {
        message = data.message;
      }
    } catch {
      // response was not JSON, ignore
    }

    throw new Error(message);
  }

  // Handle empty responses safely
  if (response.status === 204) {
    return {} as T;
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
  const res = await fetch("/api/campaign/send", {
    method: "POST",
    body: formData
  });

  return handleResponse<SendCampaignResponse>(res);
}
