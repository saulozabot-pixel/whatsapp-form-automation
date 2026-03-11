"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AgroForm() {
  const { register, watch } = useFormContext();
  const commonFields = watch(["nomeRespondente", "empresa"]);

  return (
    <div className="grid gap-6 py-4">
      <div className="p-4 bg-lime-50 rounded-lg border border-lime-200 text-sm">
        <p className="font-semibold text-lime-700 mb-2">🌱 Dados Herdados (Agronegócio):</p>
        <div className="flex gap-4 opacity-70">
          <span><strong>Produtor:</strong> {commonFields[0] || "---"}</span>
          <span><strong>Fazenda/Empresa:</strong> {commonFields[1] || "---"}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="areaProducao">Área Total de Produção (Hectares)</Label>
          <Input id="areaProducao" {...register("areaProducao")} placeholder="Ex: 500 ha" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="principaisCulturas">Principais Culturas</Label>
          <Input id="principaisCulturas" {...register("principaisCulturas")} placeholder="Ex: Soja, Milho, Algodão" />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="maquinarioProprio">Maquinário Próprio (Relacionar)</Label>
        <Textarea 
          id="maquinarioProprio" 
          {...register("maquinarioProprio")} 
          placeholder="Tratores, colheitadeiras, pulverizadores..."
          className="h-24"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="oportunidadesSetor">Oportunidades de Expansão</Label>
        <Textarea 
          id="oportunidadesSetor" 
          {...register("oportunidadesSetor")} 
          placeholder="Novas tecnologias, aumento de área, irrigação..."
          className="h-24"
        />
      </div>
    </div>
  );
}
