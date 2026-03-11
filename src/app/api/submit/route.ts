import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReportPDF } from "@/lib/pdf-generator";
import { supabase } from "@/lib/supabase";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // 0. Persist to Database (Supabase)
    const { error: dbError } = await supabase
      .from("submissions")
      .insert([{ 
        company: data.empresa, 
        client_name: data.nomeRespondente, 
        form_data: data 
      }]);

    if (dbError) {
      console.warn("Database save error (continuing with PDF/Email):", dbError);
    }

    // 1. Generate PDF Buffer
    const pdfComponent = React.createElement(ReportPDF, { data });
    const pdfBuffer = await renderToBuffer(pdfComponent);

    // 2. Send Emails via Resend
    const { data: emailData, error } = await resend.emails.send({
      from: "Automação <onboarding@resend.dev>",
      to: [data.email, "saulo.zabot@gmail.com"],
      subject: `Relatório de Solicitação - ${data.empresa}`,
      text: `Olá ${data.nomeRespondente},\n\nSegue em anexo o relatório técnico gerado para a sua solicitação referente à empresa ${data.empresa}.\n\nAtenciosamente,\nSistema de Automação`,
      attachments: [
        {
          filename: `Relatorio_${data.empresa}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: (error as any).message || "Erro no serviço de e-mail" }, { status: 500 });
    }

    return NextResponse.json({ success: true, emailData });
  } catch (err) {
    console.error("Submission error:", err);
    return NextResponse.json({ error: "Erro ao processar solicitação" }, { status: 500 });
  }
}
