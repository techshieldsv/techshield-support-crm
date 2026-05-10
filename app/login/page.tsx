"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";
import { LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@techshieldsv.com");
  const [password, setPassword] = useState("TechShield2026!");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage(error.message);
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setMessage("Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY para iniciar sesion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-md items-center">
      <Card className="w-full shadow-soft">
        <CardHeader className="items-center text-center">
          <Image src="/techshield-isotipo.png" alt="TechShield" width={72} height={72} className="h-16 w-16 object-contain" />
          <CardTitle className="text-2xl">Acceso TechShield</CardTitle>
          <CardDescription>Supabase Auth con roles para administrador, tecnico, vendedor y cliente.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={signIn}>
            <label className="block text-sm font-medium">
              Correo
              <span className="mt-2 flex items-center gap-2 rounded-md border px-3 py-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  className="w-full bg-transparent outline-none"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </span>
            </label>
            <label className="block text-sm font-medium">
              Contrasena
              <span className="mt-2 flex items-center gap-2 rounded-md border px-3 py-2">
                <LockKeyhole className="h-4 w-4 text-muted-foreground" />
                <input
                  className="w-full bg-transparent outline-none"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </span>
            </label>
            {message && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{message}</p>}
            <Button className="w-full" disabled={loading}>{loading ? "Validando..." : "Entrar"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
