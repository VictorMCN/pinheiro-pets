"use client";

import Link from "next/link";
import {
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

import { administrativeRegions } from "@/lib/constants/administrative-regions";
import { createClient } from "@/lib/supabase/client";

import type { Ngo } from "@/types/ngo";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

type EditNgoFormProps = {
  ngo: Ngo;
};

export function EditNgoForm({
  ngo,
}: EditNgoFormProps) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        "Você precisa estar autenticado para editar esta organização.",
      );

      setIsLoading(false);
      return;
    }

    if (user.id !== ngo.owner_id) {
      setError(
        "Você não possui permissão para editar esta organização.",
      );

      setIsLoading(false);
      return;
    }

    const logo = formData.get("logo");

    let newLogoPath: string | null = null;
    let newLogoUrl: string | null = null;

    if (
      logo instanceof File &&
      logo.size > 0
    ) {
      if (!allowedImageTypes.includes(logo.type)) {
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

      newLogoPath =
        `${user.id}/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("ngo-logos")
        .upload(
          newLogoPath,
          logo,
          {
            contentType: logo.type,
            upsert: false,
          },
        );

      if (uploadError) {
        setError(
          `Não foi possível enviar a nova imagem: ${uploadError.message}`,
        );

        setIsLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("ngo-logos")
        .getPublicUrl(newLogoPath);

      newLogoUrl = publicUrl;
    }

    const updateData = {
      name: String(
        formData.get("name") ?? "",
      ).trim(),

      description: String(
        formData.get("description") ?? "",
      ).trim(),

      administrative_region: String(
        formData.get("administrativeRegion") ?? "",
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

      ...(newLogoPath && newLogoUrl
        ? {
            logo_path: newLogoPath,
            logo_url: newLogoUrl,
          }
        : {}),
    };

    const { data, error: updateError } = await supabase
      .from("ngos")
      .update(updateData)
      .eq("id", ngo.id)
      .eq("owner_id", user.id)
      .select("id")
      .maybeSingle();

    if (updateError || !data) {
      if (newLogoPath) {
        await supabase.storage
          .from("ngo-logos")
          .remove([newLogoPath]);
      }

      if (
        updateError?.message.includes(
          "at most 2 pending NGO publications",
        )
      ) {
        setError(
          "Você já possui duas organizações aguardando análise. Aguarde a moderação antes de editar este cadastro.",
        );
      } else {
        setError(
          updateError
            ? `Não foi possível atualizar a organização: ${updateError.message}`
            : "Não foi possível atualizar a organização.",
        );
      }

      setIsLoading(false);
      return;
    }

    if (
      newLogoPath &&
      ngo.logo_path &&
      newLogoPath !== ngo.logo_path
    ) {
      await supabase.storage
        .from("ngo-logos")
        .remove([ngo.logo_path]);
    }

    router.push("/conta");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {ngo.status === "APPROVED" && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="font-semibold text-amber-900">
            Esta organização está aprovada.
          </p>

          <p className="mt-2 text-sm leading-6 text-amber-800">
            Ao alterar seus dados, o cadastro voltará para análise e
            ficará temporariamente indisponível na página pública.
          </p>
        </div>
      )}

      {ngo.status === "REJECTED" && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-900">
            Esta organização foi rejeitada.
          </p>

          <p className="mt-2 text-sm text-red-800">
            Você pode corrigir as informações e enviá-la novamente
            para análise.
          </p>
        </div>
      )}

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
          defaultValue={ngo.name}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
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
          rows={5}
          required
          defaultValue={ngo.description}
          className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3"
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
          defaultValue={ngo.administrative_region}
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
        >
          {administrativeRegions.map((region) => (
            <option
              key={region}
              value={region}
            >
              {region}
            </option>
          ))}
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
          defaultValue={ngo.address ?? ""}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
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
            defaultValue={ngo.phone}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
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
            defaultValue={ngo.email ?? ""}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
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
          defaultValue={ngo.instagram ?? ""}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>

      <div>
        <label
          htmlFor="pixKey"
          className="block text-sm font-semibold text-slate-700"
        >
          Chave Pix
        </label>

        <input
          id="pixKey"
          name="pixKey"
          type="text"
          defaultValue={ngo.pix_key ?? ""}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </div>

      {ngo.logo_url && (
        <div>
          <p className="text-sm font-semibold text-slate-700">
            Imagem atual
          </p>

          <div
            className="mt-3 h-40 w-40 rounded-2xl bg-slate-100 bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("${ngo.logo_url}")`,
            }}
          />
        </div>
      )}

      <div>
        <label
          htmlFor="logo"
          className="block text-sm font-semibold text-slate-700"
        >
          Alterar logo ou imagem
        </label>

        <input
          id="logo"
          name="logo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
        />

        <p className="mt-2 text-sm text-slate-500">
          Deixe vazio para manter a imagem atual.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-emerald-700 px-6 py-3 font-semibold text-white disabled:opacity-60"
        >
          {isLoading
            ? "Salvando..."
            : "Salvar alterações"}
        </button>

        <Link
          href="/conta"
          className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}