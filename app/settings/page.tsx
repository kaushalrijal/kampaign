"use client";

import { useState } from "react";

interface SMTPConfig {
  host: string;
  port: string;
  user: string;
  appPassword: string;
  formEmail: string;
  formName: string;
}


const SettingsPage = () => {

  const [smtpConfig, setSmtpConfig] = useState<SMTPConfig>({
    host: "",
    port: "587",
    user: "",
    appPassword: "",
    fromEmail: "",
    fromName: "",
  })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight mb-2">SMTP CONFIGURATION</h2>
        <p className="text-muted-foreground text-sm">
          Configure your email provider credentials. Data is stored locally only.
        </p>
      </div>


    </div>
  )
}

export default SettingsPage