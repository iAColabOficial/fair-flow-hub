import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserApprovalPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Aprovação de Usuários</h1>
        <p className="text-muted-foreground">Gerencie solicitações de aprovação de usuários</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página será implementada em breve para gerenciar aprovações de usuários.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}