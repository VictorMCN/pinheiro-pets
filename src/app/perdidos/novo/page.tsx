import { redirect } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LostPetForm } from "@/components/lost-pets/LostPetForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewLostPetPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <p className="font-semibold text-emerald-700">Pets perdidos</p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Publicar animal desaparecido
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Preencha as informações abaixo para solicitar a publicação. O
            anúncio será analisado antes de aparecer publicamente.
          </p>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <LostPetForm />
        </section>
      </main>

      <Footer />
    </div>
  );
}