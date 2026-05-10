import type { Activity, Lead, Opportunity, Ticket } from "@/lib/types";

export const tickets: Ticket[] = [
  {
    id: "1",
    code: "TS-1048",
    title: "Firewall bloquea VPN de contabilidad",
    company: "Grupo Cuscatlan",
    requester: "Ana Martinez",
    technician: "Carlos Mejia",
    status: "in_progress",
    priority: "urgent",
    slaHours: 4,
    createdAt: "2026-05-08T09:30:00",
    satisfaction: 5
  },
  {
    id: "2",
    code: "TS-1049",
    title: "Equipo POS sin acceso a red",
    company: "Retail San Miguel",
    requester: "Mario Lopez",
    technician: "Karla Rivas",
    status: "assigned",
    priority: "high",
    slaHours: 8,
    createdAt: "2026-05-08T12:10:00"
  },
  {
    id: "3",
    code: "TS-1050",
    title: "Solicitud de respaldo para servidor",
    company: "Clinica Escalon",
    requester: "Dra. Patricia Arias",
    technician: "Carlos Mejia",
    status: "waiting_client",
    priority: "medium",
    slaHours: 24,
    createdAt: "2026-05-07T16:42:00",
    satisfaction: 4
  },
  {
    id: "4",
    code: "TS-1051",
    title: "Alta de usuario Microsoft 365",
    company: "Constructora Pacifico",
    requester: "Rene Campos",
    technician: "Luis Hernandez",
    status: "resolved",
    priority: "low",
    slaHours: 48,
    createdAt: "2026-05-06T10:05:00",
    satisfaction: 5
  }
];

export const opportunities: Opportunity[] = [
  {
    id: "o1",
    company: "Banco Local",
    title: "Monitoreo administrado 24/7",
    stage: "proposal",
    owner: "Sofia Menendez",
    value: 18500,
    closeDate: "2026-05-28"
  },
  {
    id: "o2",
    company: "Textiles Maya",
    title: "Renovacion de red Wi-Fi corporativa",
    stage: "negotiation",
    owner: "Diego Flores",
    value: 9200,
    closeDate: "2026-06-04"
  },
  {
    id: "o3",
    company: "Agroexport SA",
    title: "Mesa de ayuda mensual",
    stage: "qualified",
    owner: "Sofia Menendez",
    value: 3600,
    closeDate: "2026-05-22"
  },
  {
    id: "o4",
    company: "Hotel Costa Azul",
    title: "Camaras y control de acceso",
    stage: "won",
    owner: "Diego Flores",
    value: 12750,
    closeDate: "2026-05-06"
  }
];

export const leads: Lead[] = [
  { id: "l1", name: "Laura Chacon", company: "Distribuidora Norte", source: "WhatsApp", score: 92, owner: "Sofia Menendez" },
  { id: "l2", name: "Hector Pineda", company: "Colegio Bilingue", source: "Referido", score: 81, owner: "Diego Flores" },
  { id: "l3", name: "Monica Serpas", company: "Laboratorio Central", source: "Sitio web", score: 74, owner: "Sofia Menendez" }
];

export const activities: Activity[] = [
  { id: "a1", type: "whatsapp", subject: "Enviar cotizacion ajustada", owner: "Sofia Menendez", dueDate: "Hoy 2:00 PM", relatedTo: "Banco Local" },
  { id: "a2", type: "meeting", subject: "Revision de SLA mensual", owner: "Carlos Mejia", dueDate: "Manana 9:30 AM", relatedTo: "Grupo Cuscatlan" },
  { id: "a3", type: "call", subject: "Seguimiento de renovacion", owner: "Diego Flores", dueDate: "Lun 10:00 AM", relatedTo: "Textiles Maya" }
];

export const knowledgeArticles = [
  "Como reportar incidentes criticos",
  "Guia rapida para reiniciar equipos de red",
  "Politica de respaldos y restauracion",
  "Checklist de seguridad para nuevos usuarios"
];
