export default function Home() {
  return (
    <main
      className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 py-24 text-center dark:bg-black"
      aria-labelledby="titulo-principal"
    >
      <h1
        id="titulo-principal"
        className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
      >
        SentryHealth MX
      </h1>
      <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Plataforma de monitoreo biométrico para pacientes con enfermedades
        crónicas en México. Alineada con el Objetivo de Desarrollo Sostenible 3:
        Salud y Bienestar.
      </p>
      <p
        className="text-sm text-zinc-500 dark:text-zinc-500"
        role="status"
      >
        Proyecto en configuración inicial.
      </p>
    </main>
  );
}
