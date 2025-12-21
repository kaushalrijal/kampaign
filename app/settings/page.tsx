"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { testSMTPConnection } from "@/lib/api";
import { useState } from "react";

interface SMTPConfig {
  host: string;
  port: string;
  user: string;
  appPassword: string;
  fromEmail: string;
  fromName: string;
}

const SettingsPage = () => {
  const [envStatus, setEnvStatus] = useState<"loaded" | "not-found">(
    "not-found"
  );
  const [showPassword, togglePassword] = useState<boolean>(false);
  const [smtpConfig, setSmtpConfig] = useState<SMTPConfig>({
    host: "",
    port: "587",
    user: "",
    appPassword: "",
    fromEmail: "",
    fromName: "",
  });

  const [SMTPStatus, setSMTPStatus] = useState<
    "idle" | "testing" | "success" | "failed"
  >("idle");

  const handleTestConnection = async () => {
    try {
      setSMTPStatus("testing");
      const result = await testSMTPConnection();

      console.log(result);

      if (!result.success) {
        setSMTPStatus("failed");
        return;
      }

      setSMTPStatus("success");
    } catch (error) {
      console.log("Error: ", error);
      setSMTPStatus("failed");
    }
  };

  const handleSave = () => {
    return;
  };

  const handleChange = (field: string, value: string) => {
    setSmtpConfig((prev) => ({ ...prev, [field]: value }));
    return;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight mb-2">
          SMTP CONFIGURATION
        </h2>
        <p className="text-muted-foreground text-sm">
          Configure your email provider credentials. Data is stored locally
          only.
        </p>
      </div>

      <div className="border border-border">
        <div className="bg-secondary px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black tracking-wide">
              SMTP CREDENTIALS
            </h3>
            <div className="text-xs font-mono px-3 py-1 border border-border bg-background">
              {envStatus === "loaded" ? "ENV LOADED" : "FORM MODE"}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Host */}
            <div>
              <label className="block text-xs font-black tracking-widest mb-2">
                SMTP HOST
              </label>
              <Input
                type="text"
                value={smtpConfig.host}
                onChange={(e) => handleChange("host", e.target.value)}
                placeholder="smtp.gmail.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                e.g., smtp.gmail.com, smtp.office365.com
              </p>
            </div>

            {/* Port */}
            <div>
              <label className="block text-xs font-black tracking-widest mb-2">
                SMTP PORT
              </label>
              <Input
                type="text"
                value={smtpConfig.port}
                onChange={(e) => handleChange("port", e.target.value)}
                placeholder="587"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Usually 587 (TLS) or 465 (SSL)
              </p>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-black tracking-widest mb-2">
              SMTP USERNAME
            </label>
            <Input
              type="text"
              value={smtpConfig.user}
              onChange={(e) => handleChange("user", e.target.value)}
              placeholder="your-email@gmail.com"
            />
          </div>

          {/* App Password */}
          <div>
            <label className="block text-xs font-black tracking-widest mb-2">
              SMTP APP PASSWORD
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={smtpConfig.appPassword}
                onChange={(e) => handleChange("appPassword", e.target.value)}
                placeholder="••••••••••••••••"
              />
              <button
                type="button"
                onClick={() => togglePassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              For Gmail: Use an App Password, not your regular password
            </p>
          </div>

          <div className="border-t border-dashed border-border pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* From Email */}
              <div>
                <label className="block text-xs font-black tracking-widest mb-2">
                  FROM EMAIL
                </label>
                <Input
                  type="text"
                  value={smtpConfig.fromEmail}
                  onChange={(e) => handleChange("fromEmail", e.target.value)}
                  placeholder="sender@example.com"
                />
              </div>

              {/* From Name */}
              <div>
                <label className="block text-xs font-black tracking-widest mb-2">
                  FROM NAME
                </label>
                <Input
                  type="text"
                  value={smtpConfig.fromName}
                  onChange={(e) => handleChange("fromName", e.target.value)}
                  placeholder="Your Name"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-secondary px-8 py-4 border-t border-border flex gap-3 flex-wrap">
          <Button
            onClick={handleSave}
            className="px-6 py-2 bg-primary text-primary-foreground font-semibold text-xs tracking-wide hover:opacity-90 transition-opacity border border-foreground"
          >
            SAVE CONFIG
          </Button>
          <Button
            onClick={handleTestConnection}
            disabled={SMTPStatus === "testing"}
            className={`px-6 py-3 font-semibold text-sm tracking-wide border transition-all ${
              SMTPStatus === "success"
                ? "bg-primary text-primary-foreground border-foreground"
                : SMTPStatus === "testing"
                ? "bg-muted text-foreground border-border opacity-50 cursor-wait"
                : SMTPStatus === "failed"
                ? "bg-destructive text-white border-destructive"
                : "bg-secondary text-foreground border-border hover:bg-muted"
            }`}
          >
            {SMTPStatus === "testing"
              ? "TESTING..."
              : SMTPStatus === "success"
              ? "CONNECTION OK"
              : SMTPStatus === "failed"
              ? "SMTP Not Configured!"
              : "TEST CONNECTION"}
          </Button>
        </div>
      </div>

      <div className="p-6 border border-border bg-muted/30 space-y-4">
        <h3 className="text-xs font-black tracking-widest">INFORMATION</h3>
        <ul className="space-y-2 text-xs text-muted-foreground font-mono">
          <li>- All credentials stored locally in browser</li>
          <li>- No data sent to external servers</li>
          <li>
            - Requires SMTP_* environment variables to pre-load (optional)
          </li>
          <li>- Can be overridden via this form anytime</li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsPage;
