import { BarChart3, Download, Gauge, TimerReset } from "lucide-react";
import { MetricCard } from "@/components/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-normal">Reportes</h1>
          <p className="mt-2 text-muted-foreground">Indicadores de soporte, ventas, productividad y cumplimiento de SLA.</p>
        </div>
        <Button><Download className="h-4 w-4" /> Descargar reporte</Button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Tiempo medio de respuesta" value="18 min" hint="Primer contacto en tickets nuevos" icon={TimerReset} />
        <MetricCard title="Resolucion al primer intento" value="71%" hint="Casos cerrados sin reapertura" icon={Gauge} />
        <MetricCard title="Forecast comercial" value="$43.8k" hint="Pipeline ponderado" icon={BarChart3} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Automatizaciones recomendadas</CardTitle>
          <CardDescription>Listas para implementar con Vercel Cron, Supabase Edge Functions o proveedores externos.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {["Correo al asignar ticket", "WhatsApp si SLA esta en riesgo", "Encuesta CSAT al cerrar ticket"].map((item) => (
            <div key={item} className="rounded-md border p-4">
              <p className="font-semibold">{item}</p>
              <p className="mt-1 text-sm text-muted-foreground">Plantilla, evento y registro en notifications.</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
