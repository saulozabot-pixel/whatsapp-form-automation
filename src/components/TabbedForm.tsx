"use client";

import React, { Suspense, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, X } from "lucide-react";
import { formSchema, type FormValues } from "@/lib/form-schema";
import { supabase } from "@/lib/supabase";

// Form Tabs
import { GenericForm } from "@/components/forms/GenericForm";
import { AmazonForm } from "@/components/forms/AmazonForm";
import { AgroForm } from "@/components/forms/AgroForm";
import { ConstrucaoForm } from "@/components/forms/ConstrucaoForm";

function TabbedFormContent() {
  const searchParams = useSearchParams();
  const project = searchParams.get("project");
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

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
      setUploadingFiles(true);
      const uploadedUrls: string[] = [];

      // Upload files to Supabase Storage if any
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `uploads/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("anexo")
            .upload(filePath, file);

          if (uploadError) {
            console.error("Error uploading file:", uploadError);
            alert(`Erro ao fazer upload do arquivo ${file.name}.`);
            setUploadingFiles(false);
            return; // Abort submission on failure
          }

          const { data: publicUrlData } = supabase.storage
            .from("anexo")
            .getPublicUrl(filePath);

          uploadedUrls.push(publicUrlData.publicUrl);
        }
      }

      data.anexosUrls = uploadedUrls;

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
        methods.reset();
        setSelectedFiles([]);
      } else {
        const err = await response.json();
        alert(`Erro ao salvar: ${err.error || "Tente novamente mais tarde."}`);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Erro de conexão com o servidor.");
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
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

        {/* File Upload Section */}
        <Card className="border-slate-200 shadow-sm mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-slate-500" />
              Anexos e Documentos
            </CardTitle>
            <CardDescription>Envie fotos, planilhas ou PDFs complementares (Opcional).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="anexos" className="sr-only">Arquivos</Label>
                <Input 
                  id="anexos" 
                  type="file" 
                  multiple 
                  onChange={handleFileChange}
                  className="cursor-pointer file:text-slate-700"
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-sm font-medium text-slate-700">Arquivos Selecionados:</p>
                  <ul className="space-y-2">
                    {selectedFiles.map((file, idx) => (
                      <li key={idx} className="flex items-center justify-between p-2 text-sm bg-slate-50 border rounded-md">
                        <span className="truncate max-w-[80%] text-slate-600">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-slate-400 hover:text-red-500"
                          onClick={() => removeFile(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => { methods.reset(); setSelectedFiles([]); }}>
            Limpar
          </Button>
          <Button type="submit" disabled={methods.formState.isSubmitting || uploadingFiles}>
            {(methods.formState.isSubmitting || uploadingFiles) ? "Processando..." : "Salvar e Baixar PDF"}
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
