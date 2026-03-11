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
    const pdfComponent = React.createElement(ReportPDF, { data }) as any;
    const pdfBuffer = await renderToBuffer(pdfComponent);
    
    // Convert buffer to base64 to send to frontend
    const pdfBase64 = pdfBuffer.toString("base64");

    return NextResponse.json({ success: true, pdfBase64 });
  } catch (err) {
    console.error("Submission error:", err);
    return NextResponse.json({ error: "Erro ao processar solicitação" }, { status: 500 });
  }
}
