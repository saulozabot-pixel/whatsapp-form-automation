"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ConstrucaoForm() {
  const { register, watch } = useFormContext();
  const commonFields = watch(["nomeRespondente", "empresa"]);

  return (
    <div className="grid gap-6 py-4">
      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 text-sm">
        <p className="font-semibold text-orange-700 mb-2">🏗️ Dados Herdados (Construção):</p>
        <div className="flex gap-4 opacity-70">
          <span><strong>Responsável:</strong> {commonFields[0] || "---"}</span>
          <span><strong>Construtora:</strong> {commonFields[1] || "---"}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="estagioProjeto">Estágio Atual do Projeto</Label>
          <Input id="estagioProjeto" {...register("estagioProjeto")} placeholder="Ex: Terraplanagem, Fundação, Acabamento" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="licencasAmbientais">Status de Licenças Ambientais/Obras</Label>
          <Input id="licencasAmbientais" {...register("licencasAmbientais")} placeholder="Ex: Aprovado, Em análise" />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="custoMateriais">Previsão de Gastos com Materiais</Label>
        <Input id="custoMateriais" {...register("custoMateriais")} placeholder="Ex: R$ 2.000.000,00" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="desafiosSetor">Desafios Logísticos/Materiais</Label>
        <Textarea 
          id="desafiosSetor" 
          {...register("desafiosSetor")} 
          placeholder="Atraso de fornecedores, custo de frete, mão de obra..."
          className="h-24"
        />
      </div>
    </div>
  );
}
