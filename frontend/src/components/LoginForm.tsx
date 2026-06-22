"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/AuthProvider";

type Mode = "login" | "signup";

const inputClass =
  "h-11 rounded-xl border border-zinc-300 bg-white px-3 text-zinc-900 transition-colors duration-200 placeholder:text-zinc-400 focus-visible:border-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-rose-500";

export default function LoginForm() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === "signup";

  const toggleMode = () => {
    setMode((current) => (current === "login" ? "signup" : "login"));
    setError("");
    setNotice("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setIsSubmitting(true);

    try {
      if (isSignup) {
        const { needsConfirmation } = await signUp(
          email.trim(),
          password,
          fullName.trim(),
        );
        if (needsConfirmation) {
          setNotice(
            "Te enviamos un correo de confirmación. Ábrelo para activar tu cuenta y luego inicia sesión.",
          );
          setMode("login");
        }
      } else {
        await signIn(email.trim(), password);
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Ocurrió un problema. Intenta de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
      <form
        onSubmit={handleSubmit}
        aria-labelledby="titulo-acceso"
        className="flex w-full flex-col gap-5 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8"
      >
        <div className="flex flex-col gap-2">
          <h1
            id="titulo-acceso"
            className="text-2xl font-semibold tracking-tight text-zinc-900"
          >
            {isSignup ? "Crea tu cuenta" : "Inicia sesión"}
          </h1>
          <p className="text-sm text-zinc-600">
            {isSignup
              ? "Regístrate para guardar y dar seguimiento a tus signos vitales."
              : "Accede para ver y registrar tus signos vitales."}
          </p>
        </div>

        {isSignup && (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="fullName"
              className="text-sm font-medium text-zinc-700"
            >
              Nombre completo
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className={inputClass}
            />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-sm font-medium text-zinc-700"
          >
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-describedby={isSignup ? "ayuda-password" : undefined}
            className={inputClass}
          />
          {isSignup && (
            <p id="ayuda-password" className="text-xs text-zinc-500">
              Mínimo 6 caracteres.
            </p>
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700"
          >
            {error}
          </p>
        )}

        {notice && (
          <p
            role="status"
            className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700"
          >
            {notice}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-zinc-900 px-4 font-medium text-white transition-colors duration-200 hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Procesando…"
            : isSignup
              ? "Crear cuenta"
              : "Entrar"}
        </button>

        <p className="text-center text-sm text-zinc-600">
          {isSignup ? "¿Ya tienes cuenta?" : "¿Aún no tienes cuenta?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="font-semibold text-rose-600 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
          >
            {isSignup ? "Inicia sesión" : "Crea una"}
          </button>
        </p>
      </form>
    </div>
  );
}
