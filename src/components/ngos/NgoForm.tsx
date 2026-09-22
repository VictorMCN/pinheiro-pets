"use client";

import Link from "next/link";
import {
  useState,
  type FormEvent,
} from "react";

import { administrativeRegions } from "@/lib/constants/administrative-regions";
import { createClient } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_PENDING_PUBLICATIONS = 2;

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

type NgoFormProps = {
  initialPendingCount: number;
};

export function NgoForm({
  initialPendingCount,
}: NgoFormProps) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] =
    useState(false);
  const [isSubmitted, setIsSubmitted] =
    useState(false);

  const [pendingCount, setPendingCount] =
    useState(initialPendingCount);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError(
        "Você precisa estar autenticado para cadastrar uma organização.",
      );
      setIsLoading(false);
      return;
    }

    const {
      count: currentPendingCount,
      error: pendingCountError,
    } = await supabase
      .from("ngos")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("owner_id", user.id)
      .eq("status", "PENDING");

    if (pendingCountError) {
      setError(
        "Não foi possível verificar suas solicitações pendentes.",
      );
      setIsLoading(false);
      return;
    }

    const verifiedPendingCount =
      currentPendingCount ?? 0;

    if (
      verifiedPendingCount >=
      MAX_PENDING_PUBLICATIONS
    ) {
      setPendingCount(verifiedPendingCount);

      setError(
        "Você já possui duas organizações aguardando análise.",
      );

      setIsLoading(false);
      return;
    }

    const logo = formData.get("logo");

    let logoPath: string | null = null;
    let logoUrl: string | null = null;

    if (
      logo instanceof File &&
      logo.size > 0
    ) {
      if (
        !allowedImageTypes.includes(
          logo.type,
        )
      ) {
        setError(
          "A imagem deve estar nos formatos JPEG, PNG ou WEBP.",
        );
        setIsLoading(false);
        return;
      }

      if (logo.size > MAX_FILE_SIZE) {
        setError(
          "A imagem deve possuir no máximo 5 MB.",
        );
        setIsLoading(false);
        return;
      }

      const extension =
        logo.type === "image/png"
          ? "png"
          : logo.type === "image/webp"
            ? "webp"
            : "jpg";

      logoPath =
        `${user.id}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("ngo-logos")
          .upload(
            logoPath,
            logo,
            {
              contentType: logo.type,
              upsert: false,
            },
          );

      if (uploadError) {
        console.error(
          "NGO logo upload error:",
          uploadError,
        );

        setError(
          `Não foi possível enviar a imagem: ${uploadError.message}`,
        );

        setIsLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("ngo-logos")
        .getPublicUrl(logoPath);

      logoUrl = publicUrl;
    }

    const { error: insertError } =
      await supabase
        .from("ngos")
        .insert({
          owner_id: user.id,

          name: String(
            formData.get("name") ?? "",
          ).trim(),

          description: String(
            formData.get("description") ?? "",
          ).trim(),

          administrative_region: String(
            formData.get(
              "administrativeRegion",
            ) ?? "",
          ).trim(),

          address:
            String(
              formData.get("address") ?? "",
            ).trim() || null,

          phone: String(
            formData.get("phone") ?? "",
          ).trim(),

          email:
            String(
              formData.get("email") ?? "",
            ).trim() || null,

          instagram:
            String(
              formData.get("instagram") ?? "",
            ).trim() || null,

          pix_key:
            String(
              formData.get("pixKey") ?? "",
            ).trim() || null,

          logo_url: logoUrl,
          logo_path: logoPath,

          status: "PENDING",
        });

    if (insertError) {
      if (logoPath) {
        await supabase.storage
          .from("ngo-logos")
          .remove([logoPath]);
      }

      console.error(
        "NGO publication insert error:",
        insertError,
      );

      if (
        insertError.message.includes(
          "at most 2 pending NGO publications",
        )
      ) {
        setPendingCount(
          MAX_PENDING_PUBLICATIONS,
        );

        setError(
          "Você já possui duas organizações aguardando análise.",
        );
      } else {
        setError(
          `Não foi possível cadastrar a organização: ${insertError.message}`,
        );
      }

      setIsLoading(false);
      return;
    }

    form.reset();

    setPendingCount(
      verifiedPendingCount + 1,
    );

    setIsSubmitted(true);
    setIsLoading(false);
  }

  if (isSubmitted) {
    const hasReachedPendingLimit =
      pendingCount >=
      MAX_PENDING_PUBLICATIONS;

    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
        <p className="text-lg font-bold text-emerald-800">
          Cadastro enviado para análise!
        </p>

        <p className="mt-3 leading-7 text-emerald-950">
          A organização foi cadastrada com sucesso e ficará pendente
          até a análise de um administrador.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          {!hasReachedPendingLimit && (
            <button
              type="button"
              onClick={() =>
                setIsSubmitted(false)
              }
              className="rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
            >
              Cadastrar outra organização
            </button>
          )}

          <Link
            href="/conta"
            className="rounded-xl border border-emerald-700 px-5 py-3 font-semibold text-emerald-700 hover:bg-emerald-100"
          >
            Ver minha conta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-700">
          Cadastros aguardando análise:{" "}
          {pendingCount}/
          {MAX_PENDING_PUBLICATIONS}
        </p>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-semibold text-slate-700"
        >
          Nome da organização
        </label>

        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Ex.: Projeto Patas Felizes"
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-semibold text-slate-700"
        >
          Descrição
        </label>

        <textarea
          id="description"
          name="description"
          required
          rows={5}
          placeholder="Conte sobre o trabalho realizado pela organização."
          className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div>
        <label
          htmlFor="administrativeRegion"
          className="block text-sm font-semibold text-slate-700"
        >
          Região administrativa
        </label>

        <select
          id="administrativeRegion"
          name="administrativeRegion"
          required
          defaultValue=""
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        >
          <option value="" disabled>
            Selecione
          </option>

          {administrativeRegions.map(
            (region) => (
              <option
                key={region}
                value={region}
              >
                {region}
              </option>
            ),
          )}
        </select>
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-semibold text-slate-700"
        >
          Endereço ou referência
        </label>

        <input
          id="address"
          name="address"
          type="text"
          placeholder="Opcional"
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-slate-700"
          >
            Telefone
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="(61) 99999-9999"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-slate-700"
          >
            E-mail
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Opcional"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="instagram"
          className="block text-sm font-semibold text-slate-700"
        >
          Instagram
        </label>

        <input
          id="instagram"
          name="instagram"
          type="text"
          placeholder="Ex.: @projetopatas"
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div>
        <label
          htmlFor="pixKey"
          className="block text-sm font-semibold text-slate-700"
        >
          Chave Pix para doações
        </label>

        <input
          id="pixKey"
          name="pixKey"
          type="text"
          placeholder="Opcional"
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />

        <p className="mt-2 text-sm text-slate-500">
          A chave será exibida publicamente após a aprovação do cadastro.
        </p>
      </div>

      <div>
        <label
          htmlFor="logo"
          className="block text-sm font-semibold text-slate-700"
        >
          Logo ou imagem da organização
        </label>

        <input
          id="logo"
          name="logo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
        />

        <p className="mt-2 text-sm text-slate-500">
          Opcional. JPEG, PNG ou WEBP. Máximo de 5 MB.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading
          ? "Enviando cadastro..."
          : "Enviar para análise"}
      </button>
    </form>
  );
}