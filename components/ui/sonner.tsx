"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import type { CSSProperties } from "react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4 text-white" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "0px",
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "bg-card text-foreground border-2 border-foreground rounded-none shadow-[6px_6px_0_0_rgba(0,0,0,0.9)] px-4 py-3 flex gap-3 items-start uppercase tracking-tight font-semibold",
          title: "text-sm leading-snug",
          description: "text-xs font-normal text-muted-foreground leading-snug",
          actionButton:
            "bg-primary text-primary-foreground rounded-none border-2 border-foreground px-3 py-2 hover:bg-primary/90",
          cancelButton:
            "bg-secondary text-foreground rounded-none border-2 border-foreground px-3 py-2 hover:bg-secondary/80",
          icon: "text-primary mt-0.5",
        },
        duration: 4200,
      }}
      {...props}
    />
  )
}

export { Toaster }
