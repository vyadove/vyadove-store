"use client";

import { useState } from "react";

import { signForNewsletter } from "@/ui/footer/actions";
import { Loader2Icon } from "lucide-react";
import { toast } from "@/components/ui/hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useTranslations } from "@/i18n/client";

export const Newsletter = () => {
  const t = useTranslations("Global.newsletter");
  const [loading, setLoading] = useState(false);

  return (
    <form
      action={async (formData) => {
        try {
          const result = await signForNewsletter(formData);

          if (result?.status && result.status < 400) {
            toast.info(t("success"), {
              position: "bottom-left",
            });
          } else {
            toast.error(t("error"), { position: "bottom-left" });
          }
        } catch (error) {
          toast.error(t("error"), { position: "bottom-left" });
        } finally {
          setLoading(false);
        }
      }}
      className="flex gap-x-2"
      onSubmit={() => {
        setLoading(true);
      }}
    >
      <Input
        className="max-w-2xl flex-1 bg-white"
        name="email"
        placeholder={t("emailPlaceholder")}
        required
        type="email"
      />
      <Button
        className="w-24 rounded-full"
        disabled={loading}
        type="submit"
        variant="default"
      >
        {loading ? (
          <Loader2Icon className="h-4 w-4 animate-spin" />
        ) : (
          t("subscribeButton")
        )}
      </Button>
    </form>
  );
};
