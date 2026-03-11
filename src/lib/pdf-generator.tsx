import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { type FormValues } from './form-schema';

// Standard font for better compatibility
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottom: '1px solid #eee',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#f1f5f9',
    padding: 6,
    marginBottom: 10,
    color: '#1e293b',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: 150,
    fontWeight: 'bold',
    color: '#475569',
  },
  value: {
    flex: 1,
    color: '#0f172a',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    borderTop: '1px solid #eee',
    paddingTop: 10,
    color: '#94a3b8',
    fontSize: 8,
  }
});

export const ReportPDF = ({ data }: { data: FormValues }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Relatório Técnico de Solicitação</Text>
        <Text style={styles.subtitle}>Gerado automaticamente via Sistema de Automação</Text>
      </View>

      {/* Geral Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Identificação & Dados Gerais</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Responsável:</Text>
          <Text style={styles.value}>{data.nomeRespondente}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Empresa:</Text>
          <Text style={styles.value}>{data.empresa}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>E-mail:</Text>
          <Text style={styles.value}>{data.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Celular/WhatsApp:</Text>
          <Text style={styles.value}>{data.celular}</Text>
        </View>
      </View>

      {/* Financing Needs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Necessidade de Financiamento</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Valor Pretendido:</Text>
          <Text style={styles.value}>{data.valorPretendido}</Text>
        </View>
        <View style={styles.section}>
          <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Justificativa:</Text>
          <Text style={styles.value}>{data.justificativa}</Text>
        </View>
      </View>

      {/* Amazon Project - Conditional Section */}
      {data.modalTransporte.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Detalhes do Projeto Amazônia</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Modais:</Text>
            <Text style={styles.value}>{data.modalTransporte.join(', ')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tamanho da Frota:</Text>
            <Text style={styles.value}>{data.tamanhoFrota || 'Não informado'}</Text>
          </View>
          <View style={styles.section}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Desafios Identificados:</Text>
            <Text style={styles.value}>{data.desafiosSetor || 'Nenhum desafio específico relatado.'}</Text>
          </View>
        </View>
      )}

      {/* Agro Project - Conditional Section [NEW] */}
      {data.areaProducao && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Detalhes do Projeto Agronegócio</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Área de Produção:</Text>
            <Text style={styles.value}>{data.areaProducao}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Culturas:</Text>
            <Text style={styles.value}>{data.principaisCulturas || 'Não informado'}</Text>
          </View>
          <View style={styles.section}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Oportunidades:</Text>
            <Text style={styles.value}>{data.oportunidadesSetor || 'Nenhuma oportunidade específica relatada.'}</Text>
          </View>
        </View>
      )}

      {/* Construction Project - Conditional Section [NEW] */}
      {data.estagioProjeto && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Detalhes da Construção Civil</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Estágio Atual:</Text>
            <Text style={styles.value}>{data.estagioProjeto}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Custo de Materiais:</Text>
            <Text style={styles.value}>{data.custoMateriais || 'Não informado'}</Text>
          </View>
        </View>
      )}
      {/* Attachments Section [NEW] */}
      {data.anexosUrls && data.anexosUrls.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Anexos e Documentos</Text>
          {data.anexosUrls.map((url, idx) => (
            <View key={idx} style={{ marginBottom: 4 }}>
              <Text style={styles.label}>Anexo {idx + 1}:</Text>
              <Text style={{ ...styles.value, color: '#2563eb' }}>{url}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.footer}>
        Documento confidencial destinado à análise de crédito e viabilidade técnica.
      </Text>
    </Page>
  </Document>
);
