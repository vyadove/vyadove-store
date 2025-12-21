"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Newsletter = () => {
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="flex gap-x-2"
      onSubmit={() => {
        setLoading(true);
      }}
    >
      <Input
        className="max-w-2xl flex-1 bg-white"
        name="email"
        required
        type="email"
      />
      <Button
        className="w-24 rounded-full"
        disabled={loading}
        type="submit"
        variant="default"
      >
        Subscribe
      </Button>
    </form>
  );
};
