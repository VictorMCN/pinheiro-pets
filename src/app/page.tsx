import Link from "next/link";
import Image from "next/image";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

const featureCards = [
  {
    title: "Pets perdidos",
    description:
      "Publique animais desaparecidos, acompanhe solicitações e ajude no reencontro de tutores e pets no Distrito Federal.",
    href: "/perdidos",
    cta: "Ver pets perdidos",
  },
  {
    title: "Adoção responsável",
    description:
      "Divulgue animais disponíveis para adoção e facilite a conexão entre protetores, lares temporários e adotantes.",
    href: "/adocao",
    cta: "Ver animais para adoção",
  },
  {
    title: "ONGs e doações",
    description:
      "Dê visibilidade a ONGs e protetores locais com informações de contato, Pix e canais de apoio à causa animal.",
    href: "/ongs",
    cta: "Conhecer ONGs",
  },
];

const steps = [
  {
    title: "Cadastre-se",
    description:
      "Crie sua conta para publicar pets perdidos, animais para adoção ou solicitar o cadastro de uma ONG.",
  },
  {
    title: "Envie sua solicitação",
    description:
      "As informações são registradas na plataforma com foto, descrição e dados essenciais.",
  },
  {
    title: "Aguarde a moderação",
    description:
      "Toda publicação passa por análise administrativa antes de ser exibida publicamente.",
  },
  {
    title: "Conecte a comunidade",
    description:
      "Depois de aprovada, a publicação fica visível para adoção, apoio financeiro ou localização do animal.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main>
        <section className="border-b border-emerald-100 bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="font-semibold text-emerald-700">
                ODS 10 • Redução das Desigualdades
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                Tecnologia social para fortalecer a causa animal no DF
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                O Pinheiro Pets é uma plataforma educacional de extensão
                universitária criada para conectar comunidade, protetores
                independentes e ONGs de proteção animal por meio de divulgação,
                adoção responsável e doações via Pix.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/cadastro"
                  className="rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
                >
                  Criar conta
                </Link>

                <Link
                  href="/perdidos"
                  className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Explorar publicações
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-2xl font-bold text-emerald-700">3</p>
                  <p className="mt-1 text-sm text-slate-600">
                    frentes principais da plataforma
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-2xl font-bold text-emerald-700">100%</p>
                  <p className="mt-1 text-sm text-slate-600">
                    educacional e gratuita
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-2xl font-bold text-emerald-700">DF</p>
                  <p className="mt-1 text-sm text-slate-600">
                    foco regional na comunidade local
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-cyan-50 via-white to-emerald-50 p-6 shadow-sm">
                <Image
                  src="/branding/pinheiro-pets-logo.png"
                  alt="Identidade visual do Pinheiro Pets"
                  width={420}
                  height={420}
                  className="h-auto w-full max-w-sm rounded-3xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-3xl">
            <p className="font-semibold text-emerald-700">
              O que você pode fazer aqui
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Uma plataforma simples, organizada e moderada
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              O objetivo do Pinheiro Pets é centralizar informações que
              normalmente ficam espalhadas em redes sociais, tornando o acesso
              mais claro para quem precisa ajudar ou encontrar ajuda.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {featureCards.map((card) => (
              <article
                key={card.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <h3 className="text-xl font-bold">
                  {card.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {card.description}
                </p>

                <Link
                  href={card.href}
                  className="mt-6 inline-flex font-semibold text-emerald-700 transition hover:text-emerald-800"
                >
                  {card.cta} →
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-emerald-100 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="max-w-3xl">
              <p className="font-semibold text-emerald-700">
                Como funciona
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Fluxo pensado para manter a plataforma organizada
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Toda publicação passa por moderação antes de ficar pública,
                reduzindo spam, evitando uso mal-intencionado e reforçando a
                proposta educacional do projeto.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700 font-bold text-white">
                    {index + 1}
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 sm:p-10">
            <p className="font-semibold text-emerald-700">
              Sobre o projeto
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Projeto educacional de extensão universitária
            </h2>

            <p className="mt-4 max-w-3xl leading-7 text-slate-700">
              Este sistema foi desenvolvido com fins acadêmicos para demonstrar
              uma solução digital voltada à inclusão tecnológica de protetores,
              ONGs e moradores interessados na causa animal no Distrito Federal.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/ongs"
                className="rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
              >
                Ver ONGs cadastradas
              </Link>

              <Link
                href="/adocao"
                className="rounded-xl border border-emerald-700 px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                Ver animais para adoção
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}