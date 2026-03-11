"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function GenericForm() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="nomeRespondente">Nome Completo</Label>
          <Input id="nomeRespondente" {...register("nomeRespondente")} placeholder="Ex: Saulo Luciano" />
          {errors.nomeRespondente && <span className="text-destructive text-sm">{errors.nomeRespondente.message as string}</span>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" {...register("email")} placeholder="saulo@exemplo.com" />
          {errors.email && <span className="text-destructive text-sm">{errors.email.message as string}</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="empresa">Nome da Empresa</Label>
          <Input id="empresa" {...register("empresa")} placeholder="Nome da Entidade/Empresa" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="cargo">Cargo</Label>
          <Input id="cargo" {...register("cargo")} placeholder="Sua função principal" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="celular">Celular / WhatsApp</Label>
          <Input id="celular" {...register("celular")} placeholder="(00) 00000-0000" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="valorPretendido">Valor Pretendido para Empréstimo</Label>
          <Input id="valorPretendido" {...register("valorPretendido")} placeholder="Ex: R$ 500.000,00" />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="justificativa">Justificativa do Financiamento</Label>
        <Textarea 
          id="justificativa" 
          {...register("justificativa")} 
          placeholder="Descreva por que a empresa precisa desse financiamento agora..."
          className="h-32"
        />
      </div>
    </div>
  );
}
