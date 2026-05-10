import { ShieldCheck, UserCog, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold tracking-normal">Ajustes del sistema</h1>
        <p className="mt-2 text-muted-foreground">Roles, seguridad, integraciones y parametros operativos.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <UserCog className="mb-3 h-5 w-5 text-primary" />
            <CardTitle>Roles</CardTitle>
            <CardDescription>Administrador, tecnico, vendedor y cliente.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {["admin", "technician", "sales", "client"].map((role) => <Badge key={role}>{role}</Badge>)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <ShieldCheck className="mb-3 h-5 w-5 text-primary" />
            <CardTitle>Seguridad</CardTitle>
            <CardDescription>Supabase Auth, RLS por rol y separacion por compania.</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Workflow className="mb-3 h-5 w-5 text-primary" />
            <CardTitle>Integraciones</CardTitle>
            <CardDescription>Correo, WhatsApp, Storage, Vercel y GitHub.</CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
