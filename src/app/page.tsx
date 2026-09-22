import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

const features = [
  {
    title: "Pets perdidos",
    description:
      "Consulte animais desaparecidos e ajude tutores a reencontrarem seus pets.",
    href: "/perdidos",
    action: "Ver pets perdidos",
    icon: "🔎",
  },
  {
    title: "Adoção responsável",
    description:
      "Conheça animais que estão procurando uma nova família e um lar seguro.",
    href: "/adocao",
    action: "Conhecer animais",
    icon: "🐾",
  },
  {
    title: "Apoie uma ONG",
    description:
      "Encontre organizações e protetores locais e conheça formas diretas de contribuir.",
    href: "/ongs",
    action: "Conhecer ONGs",
    icon: "🤝",
  },
];

const steps = [
  {
    number: "01",
    title: "Cadastre-se",
    description:
      "Crie uma conta gratuita para solicitar publicações na plataforma.",
  },
  {
    number: "02",
    title: "Envie sua publicação",
    description:
      "Cadastre um pet perdido, um animal para adoção ou solicite o cadastro de uma ONG.",
  },
  {
    number: "03",
    title: "Aguarde a análise",
    description:
      "As informações passam por uma revisão administrativa antes de ficarem públicas.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main>
        <section className="border-b border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
            <div>
              <span className="inline-flex rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700">
                Projeto de extensão universitária
              </span>

              <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Tecnologia para conectar quem cuida, quem procura e quem quer
                ajudar.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                O Pinheiro Pets reúne informações sobre animais perdidos,
                adoções e organizações de proteção animal do Distrito Federal
                em um único ambiente digital.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/perdidos"
                  className="rounded-full bg-emerald-700 px-6 py-3 text-center font-semibold text-white transition hover:bg-emerald-800"
                >
                  Ver pets perdidos
                </Link>

                <Link
                  href="/cadastro"
                  className="rounded-full border border-emerald-700 bg-white px-6 py-3 text-center font-semibold text-emerald-700 transition hover:bg-emerald-50"
                >
                  Participar da comunidade
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
              <div className="rounded-2xl bg-emerald-700 p-8 text-white">
                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-100">
                  Pinheiro Pets
                </p>

                <h2 className="mt-3 text-3xl font-bold">
                  Informação centralizada para a causa animal.
                </h2>

                <p className="mt-4 leading-7 text-emerald-50">
                  Uma proposta educacional que demonstra como a tecnologia pode
                  ampliar a visibilidade de protetores, ONGs, animais
                  desaparecidos e pets disponíveis para adoção.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4">
                <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                  <p className="text-2xl">🔎</p>
                  <p className="mt-2 text-xs font-semibold text-emerald-900">
                    Encontrar
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                  <p className="text-2xl">🐾</p>
                  <p className="mt-2 text-xs font-semibold text-emerald-900">
                    Adotar
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-4 text-center">
                  <p className="text-2xl">🤝</p>
                  <p className="mt-2 text-xs font-semibold text-emerald-900">
                    Apoiar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="font-semibold text-emerald-700">Como podemos ajudar?</p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Um espaço para diferentes necessidades da comunidade.
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Navegue pelas áreas públicas da plataforma e encontre informações
              de forma simples e centralizada.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="flex flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                  {feature.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>

                <p className="mt-3 flex-1 leading-7 text-slate-600">
                  {feature.description}
                </p>

                <Link
                  href={feature.href}
                  className="mt-6 font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  {feature.action} →
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="max-w-2xl">
              <p className="font-semibold text-emerald-700">
                Publicações responsáveis
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Como funciona uma publicação?
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Qualquer usuário cadastrado poderá solicitar uma publicação,
                mas o conteúdo será analisado antes de aparecer publicamente.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-3xl border border-slate-200 p-7"
                >
                  <span className="text-sm font-bold text-emerald-700">
                    {step.number}
                  </span>

                  <h3 className="mt-4 text-xl font-bold">{step.title}</h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-3xl bg-slate-900 px-8 py-12 text-white md:px-12">
            <div className="max-w-3xl">
              <p className="font-semibold text-emerald-300">
                Tecnologia e impacto social
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">
                Um projeto educacional alinhado à ODS 10.
              </h2>

              <p className="mt-5 leading-7 text-slate-300">
                O Pinheiro Pets foi desenvolvido como projeto de extensão
                universitária para explorar o uso da tecnologia na ampliação do
                acesso à informação e da visibilidade de iniciativas locais
                ligadas à proteção animal no Distrito Federal.
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                Esta aplicação possui finalidade exclusivamente educacional e
                demonstrativa e não representa um serviço oficial de proteção
                animal.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}