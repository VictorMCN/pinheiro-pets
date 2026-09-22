"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type PublicationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

type AdoptionModerationActionsProps = {
  petId: string;
  status: PublicationStatus;
  imagePath: string | null;
};

export function AdoptionModerationActions({
  petId,
  status,
  imagePath,
}: AdoptionModerationActionsProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] = useState("");

  async function handleStatusChange(
    newStatus: "APPROVED" | "REJECTED",
  ) {
    const action =
      newStatus === "APPROVED"
        ? "aprovar"
        : "rejeitar";

    const confirmed = window.confirm(
      `Tem certeza que deseja ${action} esta publicação de adoção?`,
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setIsLoading(true);

    const supabase = createClient();

    const {
      data,
      error: updateError,
    } = await supabase
      .from("adoption_pets")
      .update({
        status: newStatus,
      })
      .eq("id", petId)
      .eq("status", "PENDING")
      .select("id")
      .maybeSingle();

    if (updateError || !data) {
      setError(
        "Não foi possível atualizar a publicação.",
      );

      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta publicação de adoção? Esta ação não poderá ser desfeita.",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setIsLoading(true);

    const supabase = createClient();

    const {
      data,
      error: deleteError,
    } = await supabase
      .from("adoption_pets")
      .delete()
      .eq("id", petId)
      .select("id")
      .maybeSingle();

    if (deleteError || !data) {
      setError(
        "Não foi possível excluir a publicação.",
      );

      setIsLoading(false);
      return;
    }

    if (imagePath) {
      const { error: storageError } =
        await supabase.storage
          .from("adoption-pets")
          .remove([imagePath]);

      if (storageError) {
        window.alert(
          "A publicação foi excluída, mas não foi possível remover a imagem do armazenamento.",
        );
      }
    }

    setIsLoading(false);
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {status === "PENDING" && (
          <>
            <button
              type="button"
              onClick={() =>
                handleStatusChange(
                  "APPROVED",
                )
              }
              disabled={isLoading}
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Aprovar
            </button>

            <button
              type="button"
              onClick={() =>
                handleStatusChange(
                  "REJECTED",
                )
              }
              disabled={isLoading}
              className="rounded-xl border border-amber-300 px-5 py-2.5 text-sm font-semibold text-amber-800 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Rejeitar
            </button>
          </>
        )}

        <button
          type="button"
          onClick={handleDelete}
          disabled={isLoading}
          className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Excluir publicação
        </button>
      </div>

      {isLoading && (
        <p className="mt-3 text-sm text-slate-500">
          Processando solicitação...
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}