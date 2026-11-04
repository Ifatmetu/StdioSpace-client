"use client";

import { toast as baseToast } from "@/components/ui/toast";

export const toast = {
  success: (title: string, description?: string) => {
    baseToast.create({
      title,
      description,
      type: "success",
    });
  },
  error: (title: string, description?: string) => {
    baseToast.create({
      title,
      description,
      type: "error",
    });
  },
  info: (title: string, description?: string) => {
    baseToast.create({
      title,
      description,
      type: "info",
    });
  },
  warning: (title: string, description?: string) => {
    baseToast.create({
      title,
      description,
      type: "warning",
    });
  },
};
