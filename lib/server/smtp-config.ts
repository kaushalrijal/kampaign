/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import "server-only";

interface SMTPConfig {
  HOST: string;
  PORT: number;
  SECURE: boolean;
  USER: string;
  APP_PASSWORD: string;
}

export const getEnvSMTPConfig = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_APP_PASSWORD } =
    process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_APP_PASSWORD) {
    return null;
  }

  return {
    HOST: SMTP_HOST,
    PORT: Number(SMTP_PORT),
    SECURE: SMTP_SECURE == "true",
    USER: SMTP_USER,
    APP_PASSWORD: SMTP_APP_PASSWORD,
  };
};
