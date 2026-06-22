"use client";

import Dashboard from "@/components/Dashboard";
import LoginForm from "@/components/LoginForm";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <p role="status" className="text-sm text-zinc-500">
          Cargando…
        </p>
      </main>
    );
  }

  return user ? <Dashboard /> : <LoginForm />;
}
