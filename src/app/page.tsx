import { TabbedForm } from "@/components/TabbedForm";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Automação de Formulário & Projetos
          </h1>
          <p className="mt-3 text-xl text-slate-500">
            Preencha os dados para gerar seu PDF técnico e enviar por e-mail automaticamente.
          </p>
          
          {/* Manager Control Panel simulation */}
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-slate-700 self-center mr-2">Links para o Cliente:</span>
            <Link href="/" className="text-xs px-3 py-1 bg-white border rounded shadow-sm hover:bg-slate-100 italic text-slate-600">
              🔗 Todos os Projetos
            </Link>
            <Link href="/?project=amazonia" className="text-xs px-3 py-1 bg-white border rounded shadow-sm hover:bg-slate-100 italic text-slate-600">
              🔗 Só Amazônia
            </Link>
            <Link href="/?project=agro" className="text-xs px-3 py-1 bg-white border rounded shadow-sm hover:bg-slate-100 italic text-slate-600">
              🔗 Só Agronegócio
            </Link>
            <Link href="/?project=construcao" className="text-xs px-3 py-1 bg-white border rounded shadow-sm hover:bg-slate-100 italic text-slate-600">
              🔗 Só Construção
            </Link>
          </div>
        </div>

        <TabbedForm />
      </div>
    </main>
  );
}
