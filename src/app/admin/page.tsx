"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ExternalLink, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [host, setHost] = useState("");
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setHost(window.location.origin);
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) {
      setSubmissions(data);
    }
    setLoading(false);
  };

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
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Últimas Respostas</CardTitle>
                  <CardDescription>Informações submetidas pelos clientes com opção de expandir os dados.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={fetchSubmissions} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Atualizar
                </Button>
              </CardHeader>
              <CardContent>
                {loading && submissions.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">Carregando respostas do banco de dados...</div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg text-slate-400">
                    <p>Nenhuma resposta encontrada.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((sub) => (
                      <div key={sub.id} className="border rounded-md bg-white overflow-hidden shadow-sm">
                        <div 
                          className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors"
                          onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                        >
                          <div>
                            <h3 className="font-semibold text-lg text-slate-800">{sub.company || "Empresa não informada"}</h3>
                            <div className="flex gap-4 text-sm text-slate-500 mt-1">
                              <span><strong>Cliente:</strong> {sub.client_name || "N/A"}</span>
                              <span><strong>Data:</strong> {new Date(sub.created_at).toLocaleString('pt-BR')}</span>
                            </div>
                          </div>
                          <div>
                            {expandedId === sub.id ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                          </div>
                        </div>
                        
                        {expandedId === sub.id && (
                          <div className="p-4 bg-slate-50 border-t text-sm">
                            <h4 className="font-semibold mb-2 text-slate-700">Dados do Formulário:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                              {Object.entries(sub.form_data).map(([key, value]) => {
                                // Skip empty values or complex arrays for simple display
                                if (!value || (Array.isArray(value) && value.length === 0)) return null;
                                return (
                                  <div key={key} className="flex flex-col py-1 border-b border-slate-100">
                                    <span className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                    <span className="font-medium text-slate-900 break-words break-all">
                                      {Array.isArray(value) ? value.join(", ") : String(value)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
