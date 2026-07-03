"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotifyForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="rounded-lg bg-secondary px-4 py-3 text-sm text-gray-700">
        Dziękujemy! Damy Ci znać, gdy panel analityki będzie gotowy.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="email"
          required
          placeholder="twoj@email.pl"
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-3 pl-10 text-sm text-gray-900 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>
      <Button type="submit" size="lg" className="sm:w-auto">
        Powiadom mnie, gdy ruszy
      </Button>
    </form>
  );
}
