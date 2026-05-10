export type Role = "admin" | "technician" | "sales" | "client";
export type TicketStatus = "new" | "assigned" | "in_progress" | "waiting_client" | "resolved" | "closed";
export type Priority = "low" | "medium" | "high" | "urgent";
export type OpportunityStage = "prospecting" | "qualified" | "proposal" | "negotiation" | "won" | "lost";

export type Ticket = {
  id: string;
  code: string;
  title: string;
  company: string;
  requester: string;
  technician: string;
  status: TicketStatus;
  priority: Priority;
  slaHours: number;
  createdAt: string;
  satisfaction?: number;
};

export type Opportunity = {
  id: string;
  company: string;
  title: string;
  stage: OpportunityStage;
  owner: string;
  value: number;
  closeDate: string;
};

export type Lead = {
  id: string;
  name: string;
  company: string;
  source: string;
  score: number;
  owner: string;
};

export type Activity = {
  id: string;
  type: "call" | "email" | "whatsapp" | "meeting" | "task";
  subject: string;
  owner: string;
  dueDate: string;
  relatedTo: string;
};
