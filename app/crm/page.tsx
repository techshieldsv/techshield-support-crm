import { Mail, MessageCircle, Phone, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { activities, leads, opportunities } from "@/lib/demo-data";
import { currency } from "@/lib/utils";
import type { OpportunityStage } from "@/lib/types";

const stages: OpportunityStage[] = ["prospecting", "qualified", "proposal", "negotiation", "won"];

export default function CrmPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-normal">CRM comercial</h1>
          <p className="mt-2 text-muted-foreground">Leads, clientes, oportunidades, cotizaciones y actividades de seguimiento.</p>
        </div>
        <Button><Plus className="h-4 w-4" /> Nueva oportunidad</Button>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Kanban</CardTitle>
            <CardDescription>Vista de ventas similar a HubSpot con etapas configurables.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 overflow-x-auto md:grid-cols-5">
            {stages.map((stage) => (
              <div key={stage} className="kanban-column min-h-[360px] rounded-md border bg-muted/30 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold capitalize">{stage}</p>
                  <Badge>{opportunities.filter((item) => item.stage === stage).length}</Badge>
                </div>
                <div className="space-y-3">
                  {opportunities.filter((item) => item.stage === stage).map((item) => (
                    <div key={item.id} className="rounded-md border bg-card p-3 shadow-sm">
                      <p className="font-medium">{item.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.company}</p>
                      <p className="mt-3 text-sm font-bold">{currency.format(item.value)}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.owner} - {item.closeDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leads calientes</CardTitle>
              <CardDescription>Priorizados por score comercial.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {leads.map((lead) => (
                <div key={lead.id} className="rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{lead.name}</p>
                    <Badge tone={lead.score > 85 ? "green" : "amber"}>{lead.score}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{lead.company} - {lead.source}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Seguimientos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activities.map((activity) => {
                const Icon = activity.type === "whatsapp" ? MessageCircle : activity.type === "email" ? Mail : Phone;
                return (
                  <div key={activity.id} className="flex gap-3 rounded-md border p-3">
                    <Icon className="mt-1 h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{activity.subject}</p>
                      <p className="text-xs text-muted-foreground">{activity.dueDate}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
