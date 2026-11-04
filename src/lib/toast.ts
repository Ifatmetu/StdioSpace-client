"use client";

import hotToast from "react-hot-toast";

const base = {
  duration: 4000,
  style: {
    borderRadius: "16px",
    background: "#14142b",
    color: "#ffffff",
    fontSize: "14px",
    maxWidth: "380px",
  },
};

export const toast = {
  success: (title: string, description?: string) => {
    hotToast.success(description ? `${title} — ${description}` : title, {
      ...base,
      iconTheme: { primary: "#db1a6e", secondary: "#ffffff" },
    });
  },
  error: (title: string, description?: string) => {
    hotToast.error(description ? `${title} — ${description}` : title, base);
  },
  info: (title: string, description?: string) => {
    hotToast(description ? `${title} — ${description}` : title, {
      ...base,
      icon: "ℹ️",
    });
  },
  warning: (title: string, description?: string) => {
    hotToast(description ? `${title} — ${description}` : title, {
      ...base,
      icon: "⚠️",
    });
  },
};
