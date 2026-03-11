"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export function AmazonForm() {
  const { register, watch, setValue } = useFormContext();

  // Watch common fields to show "inheritance" in UI (optional visual feedback)
  const commonFields = watch(["nomeRespondente", "empresa", "celular"]);

  const tipoServico = ["Transporte de cargas", "Transporte de passageiros"];
  const modais = ["Fluvial", "Aéreo", "Urbano (ônibus)", "Rodoviário (caminhão)", "Rodoviário (ônibus)"];

  return (
    <div className="grid gap-6 py-4">
      {/* Visual Indicator of Data Inheritance */}
      <div className="p-4 bg-muted rounded-lg border border-dashed text-sm">
        <p className="font-semibold mb-2">Dados Herdados do Geral:</p>
        <div className="flex gap-4 opacity-70">
          <span><strong>Nome:</strong> {commonFields[0] || "---"}</span>
          <span><strong>Empresa:</strong> {commonFields[1] || "---"}</span>
          <span><strong>WhatsApp:</strong> {commonFields[2] || "---"}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Tipo de Serviço</Label>
          <div className="flex gap-4 flex-wrap mt-2">
            {tipoServico.map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox 
                  id={`service-${service}`}
                  onCheckedChange={(checked) => {
                    const currentValues = watch("tipoServico") || [];
                    if (checked) {
                      setValue("tipoServico", [...currentValues, service]);
                    } else {
                      setValue("tipoServico", currentValues.filter((v: string) => v !== service));
                    }
                  }}
                />
                <label htmlFor={`service-${service}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {service}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Modal de Transporte</Label>
          <div className="flex gap-4 flex-wrap mt-2">
            {modais.map((modal) => (
              <div key={modal} className="flex items-center space-x-2">
                <Checkbox 
                  id={`modal-${modal}`}
                  onCheckedChange={(checked) => {
                    const currentValues = watch("modalTransporte") || [];
                    if (checked) {
                      setValue("modalTransporte", [...currentValues, modal]);
                    } else {
                      setValue("modalTransporte", currentValues.filter((v: string) => v !== modal));
                    }
                  }}
                />
                <label htmlFor={`modal-${modal}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {modal}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="tamanhoFrota">Tamanho da Frota (Tipos e Qtd)</Label>
          <Input id="tamanhoFrota" {...register("tamanhoFrota")} placeholder="Ex: 5 balsas, 2 caminhões..." />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="destinosAtendidos">Principais Destinos</Label>
          <Input id="destinosAtendidos" {...register("destinosAtendidos")} placeholder="Ex: Manaus, Belém, Santarém..." />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="desafiosSetor">Principais Desafios na Amazônia</Label>
        <Textarea 
          id="desafiosSetor" 
          {...register("desafiosSetor")} 
          placeholder="Descreva os desafios logísticos, burocráticos ou climáticos..."
          className="h-24"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="garantias">Garantias Disponíveis</Label>
        <Textarea 
          id="garantias" 
          {...register("garantias")} 
          placeholder="Imóveis, recebíveis, seguro garantidor..."
          className="h-24"
        />
      </div>
    </div>
  );
}
