import { CheckCircle2, Download, FileCheck2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tickets } from "@/lib/demo-data";

export default function PortalPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-normal">Portal del cliente</h1>
          <p className="mt-2 text-muted-foreground">Autoservicio para crear tickets, consultar estados y aprobar cotizaciones.</p>
        </div>
        <Button><Plus className="h-4 w-4" /> Nuevo caso</Button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Crear tickets</CardTitle>
            <CardDescription>Formulario guiado con prioridad, categoria y adjuntos.</CardDescription>
          </CardHeader>
          <CardContent><Button variant="outline">Abrir formulario</Button></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reportes</CardTitle>
            <CardDescription>Descarga de informes mensuales y bitacoras.</CardDescription>
          </CardHeader>
          <CardContent><Button variant="outline"><Download className="h-4 w-4" /> Descargar PDF</Button></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cotizaciones</CardTitle>
            <CardDescription>Aprobacion digital para acelerar el cierre.</CardDescription>
          </CardHeader>
          <CardContent><Button variant="outline"><FileCheck2 className="h-4 w-4" /> Revisar</Button></CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Mis tickets recientes</CardTitle>
          <CardDescription>Vista simplificada para contactos autorizados.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="rounded-md border p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{ticket.code}</p>
                <Badge tone={ticket.status === "resolved" ? "green" : "cyan"}>{ticket.status.replace("_", " ")}</Badge>
              </div>
              <p className="mt-2 text-sm">{ticket.title}</p>
              <p className="mt-2 text-xs text-muted-foreground">{ticket.requester} - {ticket.company}</p>
              {ticket.status === "resolved" && (
                <div className="mt-3 flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" /> Listo para encuesta de satisfaccion
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
