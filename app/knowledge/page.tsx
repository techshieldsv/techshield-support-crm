import { BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { knowledgeArticles } from "@/lib/demo-data";

export default function KnowledgePage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-bold tracking-normal">Base de conocimiento</h1>
        <p className="mt-2 text-muted-foreground">Articulos internos y publicos para reducir tickets repetitivos.</p>
      </section>

      <div className="flex max-w-2xl items-center gap-2 rounded-md border bg-card px-3 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input className="w-full bg-transparent text-sm outline-none" placeholder="Buscar guia, politica o procedimiento" />
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {knowledgeArticles.map((article) => (
          <Card key={article}>
            <CardHeader>
              <BookOpen className="mb-3 h-5 w-5 text-primary" />
              <CardTitle>{article}</CardTitle>
              <CardDescription>Publicado para tecnicos y clientes autorizados.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm">Leer articulo</Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
