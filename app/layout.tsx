import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { BarChart3, BookOpen, Building2, Headphones, LayoutDashboard, LogIn, Settings, ShieldCheck, Users } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tickets", label: "Tickets", icon: Headphones },
  { href: "/crm", label: "CRM", icon: Building2 },
  { href: "/portal", label: "Portal", icon: Users },
  { href: "/knowledge", label: "Base", icon: BookOpen },
  { href: "/reports", label: "Reportes", icon: BarChart3 },
  { href: "/settings", label: "Ajustes", icon: Settings },
  { href: "/login", label: "Acceso", icon: LogIn }
];

export const metadata: Metadata = {
  title: "TechShield Support CRM",
  description: "Sistema empresarial de tickets, CRM y portal de cliente para TechShield."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <div className="min-h-screen bg-background">
            <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r bg-card/95 px-4 py-5 lg:block">
              <Link href="/dashboard" className="mb-8 flex items-center gap-3">
                <Image src="/techshield-isotipo.png" alt="TechShield" width={46} height={46} className="h-11 w-11 object-contain" />
                <div>
                  <div className="text-lg font-bold leading-tight">TechShield</div>
                  <div className="text-xs text-muted-foreground">Soporte + CRM</div>
                </div>
              </Link>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="absolute bottom-5 left-4 right-4 rounded-lg border bg-background p-4">
                <ShieldCheck className="mb-2 h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">Tecnologia confiable, resultados reales.</p>
                <p className="mt-1 text-xs text-muted-foreground">El Salvador</p>
              </div>
            </aside>
            <div className="lg:pl-64">
              <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/92 px-4 backdrop-blur md:px-8">
                <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
                  <Image src="/techshield-isotipo.png" alt="TechShield" width={34} height={34} className="h-8 w-8 object-contain" />
                  <span className="font-semibold">TechShield</span>
                </Link>
                <div className="hidden text-sm text-muted-foreground md:block">ventas.techshield@techshieldsv.com - WhatsApp +503 7428-0692</div>
                <ThemeToggle />
              </header>
              <main className="px-4 py-6 md:px-8">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
