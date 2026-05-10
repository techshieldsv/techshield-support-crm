import { FileUp, MessageSquarePlus, Plus, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tickets } from "@/lib/demo-data";

const ticketActions = [
  { title: "Adjuntos", text: "Imagenes, PDFs y evidencias en Supabase Storage", icon: FileUp },
  { title: "Comentarios", text: "Historial interno y respuesta al cliente", icon: MessageSquarePlus },
  { title: "Notificaciones", text: "Correo y WhatsApp al crear, asignar y cerrar", icon: Plus }
];

const statusTone = {
  new: "blue",
  assigned: "cyan",
  in_progress: "amber",
  waiting_client: "slate",
  resolved: "green",
  closed: "green"
} as const;

export default function TicketsPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-normal">Sistema de tickets</h1>
          <p className="mt-2 text-muted-foreground">Creacion, asignacion, adjuntos, comentarios, SLA y cierre con encuesta.</p>
        </div>
        <Button><Plus className="h-4 w-4" /> Crear ticket</Button>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Cola de soporte</CardTitle>
            <CardDescription>Tickets activos organizados para el equipo tecnico.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b text-left text-muted-foreground">
                <tr>
                  <th className="py-3 font-medium">Ticket</th>
                  <th className="py-3 font-medium">Cliente</th>
                  <th className="py-3 font-medium">Tecnico</th>
                  <th className="py-3 font-medium">Estado</th>
                  <th className="py-3 font-medium">SLA</th>
                  <th className="py-3 font-medium">CSAT</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b last:border-0">
                    <td className="py-4">
                      <p className="font-semibold">{ticket.code}</p>
                      <p className="text-muted-foreground">{ticket.title}</p>
                    </td>
                    <td className="py-4">{ticket.company}</td>
                    <td className="py-4">{ticket.technician}</td>
                    <td className="py-4">
                      <Badge tone={statusTone[ticket.status]}>{ticket.status.replace("_", " ")}</Badge>
                    </td>
                    <td className="py-4">{ticket.slaHours}h</td>
                    <td className="py-4">
                      {ticket.satisfaction ? (
                        <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 text-amber-500" /> {ticket.satisfaction}</span>
                      ) : (
                        <span className="text-muted-foreground">Pendiente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Flujo del caso</CardTitle>
            <CardDescription>Acciones operativas listas para conectar con Supabase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {ticketActions.map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-md border p-4">
                <Icon className="mb-3 h-5 w-5 text-primary" />
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
