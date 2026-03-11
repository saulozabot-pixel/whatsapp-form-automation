"use client";

import React, { Suspense } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formSchema, type FormValues } from "@/lib/form-schema";

// Form Tabs
import { GenericForm } from "@/components/forms/GenericForm";
import { AmazonForm } from "@/components/forms/AmazonForm";
import { AgroForm } from "@/components/forms/AgroForm";
import { ConstrucaoForm } from "@/components/forms/ConstrucaoForm";

function TabbedFormContent() {
  const searchParams = useSearchParams();
  const project = searchParams.get("project");

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      nomeRespondente: "",
      empresa: "",
      cargo: "",
      email: "",
      celular: "",
      valorPretendido: "",
      justificativa: "",
      tipoServico: [],
      modalTransporte: [],
      areaProducao: "",
      principaisCulturas: "",
      maquinarioProprio: "",
      estagioProjeto: "",
      licencasAmbientais: "",
      custoMateriais: "",
      desafiosSetor: "",
      oportunidadesSetor: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Trigger PDF Download
        if (result.pdfBase64) {
          const byteCharacters = atob(result.pdfBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: "application/pdf" });
          
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `Relatorio_${data.empresa.replace(/[^a-z0-9]/gi, '_')}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }

        alert("Sucesso! Os dados foram salvos e o PDF foi baixado no seu dispositivo.");
      } else {
        const err = await response.json();
        alert(`Erro ao salvar: ${err.error || "Tente novamente mais tarde."}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Erro de conexão com o servidor.");
    }
  };

  const showAmazon = !project || project === "amazonia";
  const showAgro = !project || project === "agro";
  const showConstrucao = !project || project === "construcao";

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="generic" className="w-full">
          <TabsList className={`grid w-full ${!project ? "grid-cols-4" : "grid-cols-2"}`}>
            <TabsTrigger value="generic">🏦 Geral</TabsTrigger>
            {showAmazon && <TabsTrigger value="amazon">🌳 Amazônia</TabsTrigger>}
            {showAgro && <TabsTrigger value="agro">🚜 Agro</TabsTrigger>}
            {showConstrucao && <TabsTrigger value="construcao">🏗️ Construção</TabsTrigger>}
          </TabsList>

          <TabsContent value="generic">
            <Card>
              <CardHeader>
                <CardTitle>Dados Gerais & Necessidades</CardTitle>
                <CardDescription>
                  Preencha as informações básicas da sua empresa e a finalidade do financiamento.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GenericForm />
              </CardContent>
            </Card>
          </TabsContent>

          {showAmazon && (
            <TabsContent value="amazon">
              <Card>
                <CardHeader>
                  <CardTitle>Projeto Amazônia</CardTitle>
                  <CardDescription>Logística e desafios na região Amazônica.</CardDescription>
                </CardHeader>
                <CardContent>
                  <AmazonForm />
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {showAgro && (
            <TabsContent value="agro">
              <Card>
                <CardHeader>
                  <CardTitle>Projeto Agronegócio</CardTitle>
                  <CardDescription>Informações sobre produção, culturas e maquinário.</CardDescription>
                </CardHeader>
                <CardContent>
                  <AgroForm />
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {showConstrucao && (
            <TabsContent value="construcao">
              <Card>
                <CardHeader>
                  <CardTitle>Projeto Construção Civil</CardTitle>
                  <CardDescription>Estágio do projeto, licenças e custos de materiais.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ConstrucaoForm />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => methods.reset()}>
            Limpar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processando..." : "Salvar e Baixar PDF"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export function TabbedForm() {
  return (
    <Suspense fallback={<div>Carregando formulário...</div>}>
      <TabbedFormContent />
    </Suspense>
  );
}
