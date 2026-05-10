import { Activity, Clock3, DollarSign, Headphones, Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/metric-card";
import { activities, opportunities, tickets } from "@/lib/demo-data";
import { currency } from "@/lib/utils";

export default function DashboardPage() {
  const openTickets = tickets.filter((ticket) => !["resolved", "closed"].includes(ticket.status)).length;
  const monthlySales = opportunities.filter((item) => item.stage === "won").reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-medium text-primary">TechShield Support CRM</p>
          <h1 className="mt-1 text-3xl font-bold tracking-normal">Centro ejecutivo</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Tickets, ventas, SLA y actividades comerciales en una sola operacion para clientes de El Salvador.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Exportar reporte</Button>
          <Button>Nuevo ticket</Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Tickets abiertos" value={String(openTickets)} hint="2 con prioridad alta o urgente" icon={Headphones} />
        <MetricCard title="SLA promedio" value="94%" hint="Cumplimiento de los ultimos 30 dias" icon={Clock3} />
        <MetricCard title="Ventas del mes" value={currency.format(monthlySales)} hint="Cotizaciones aprobadas" icon={DollarSign} />
        <MetricCard title="Satisfaccion" value="4.7/5" hint="Encuestas cerradas" icon={Star} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>Tickets prioritarios</CardTitle>
            <CardDescription>Incidentes activos con seguimiento tecnico.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tickets.slice(0, 3).map((ticket) => (
              <div key={ticket.id} className="grid gap-3 rounded-md border p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{ticket.code}</span>
                    <Badge tone={ticket.priority === "urgent" ? "red" : ticket.priority === "high" ? "amber" : "blue"}>
                      {ticket.priority}
                    </Badge>
                    <Badge tone="cyan">{ticket.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="mt-2 text-sm">{ticket.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {ticket.company} - Tecnico: {ticket.technician} - SLA {ticket.slaHours}h
                  </p>
                </div>
                <Button variant="outline" size="sm">Ver caso</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agenda inteligente</CardTitle>
            <CardDescription>Seguimientos por correo, WhatsApp y reuniones.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-md bg-accent text-primary">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.relatedTo} - {item.owner} - {item.dueDate}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Pipeline comercial</CardTitle>
            <CardDescription>Vista ejecutiva de oportunidades activas.</CardDescription>
          </div>
          <TrendingUp className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          {opportunities.map((item) => (
            <div key={item.id} className="rounded-md border p-4">
              <Badge tone={item.stage === "won" ? "green" : "blue"}>{item.stage}</Badge>
              <p className="mt-3 font-semibold">{item.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.company}</p>
              <p className="mt-3 text-lg font-bold">{currency.format(item.value)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
