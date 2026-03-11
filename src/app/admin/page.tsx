"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ExternalLink } from "lucide-react";

export default function AdminDashboard() {
  const [host, setHost] = useState("");

  useEffect(() => {
    setHost(window.location.origin);
  }, []);

  const projectLinks = [
    { name: "Padrão (Todas as Abas)", path: "/" },
    { name: "Projeto Amazônia", path: "/?project=amazonia" },
    { name: "Projeto Agronegócio", path: "/?project=agro" },
    { name: "Projeto Construção", path: "/?project=construcao" },
  ];

  const copyToClipboard = (path: string) => {
    navigator.clipboard.writeText(`${host}${path}`);
    alert("Link copiado para a área de transferência!");
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Painel Master do Gestor</h1>
          <p className="text-slate-500">Gerencie links de captação e visualize respostas dos clientes.</p>
        </div>

        <Tabs defaultValue="links">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="links">🔗 Links de Projeto</TabsTrigger>
            <TabsTrigger value="submissions">📄 Respostas Recebidas</TabsTrigger>
          </TabsList>

          <TabsContent value="links" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {projectLinks.map((link) => (
                <Card key={link.path}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{link.name}</CardTitle>
                    <CardDescription>{host}{link.path}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(link.path)}>
                      <Copy className="h-4 w-4 mr-2" /> Copiar Link
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => window.open(link.path, "_blank")}>
                      <ExternalLink className="h-4 w-4 mr-2" /> Abrir
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Últimas Respostas</CardTitle>
                <CardDescription>Visualize as informações submetidas pelos seus clientes (Integração com Banco de Dados).</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 border-2 border-dashed rounded-lg text-slate-400">
                  <p>As respostas salvas no banco aparecerão aqui.</p>
                  <p className="text-xs mt-2">(Aguardando configuração das variáveis de ambiente do Supabase)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
