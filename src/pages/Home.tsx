import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Award, Users, BookOpen, TrendingUp, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import febicLogo from "@/assets/febic-logo.png";

const Home = () => {
  const features = [
    {
      icon: Users,
      title: "Gestão de Usuários",
      description: "Sistema completo de registro, aprovação e permissões baseadas em funções"
    },
    {
      icon: BookOpen,
      title: "Sistema de Projetos",
      description: "Criação, documentação e acompanhamento de submissões de projetos de ponta a ponta"
    },
    {
      icon: Award,
      title: "Sistema de Avaliação",
      description: "Distribuição automatizada e interface abrangente de avaliação"
    },
    {
      icon: TrendingUp,
      title: "Integração Financeira",
      description: "Integração com ASAAS para pagamentos automáticos e relatórios"
    },
    {
      icon: Shield,
      title: "Segurança e Auditoria",
      description: "Logs completos de auditoria e gestão segura de permissões"
    },
    {
      icon: Clock,
      title: "Atualizações em Tempo Real",
      description: "Notificações ao vivo e comunicação durante todo o ciclo da feira"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={febicLogo} alt="FEBIC" className="h-8 w-auto" />
            <div>
              <h1 className="text-lg font-bold text-foreground">FEBIC</h1>
              <p className="text-xs text-muted-foreground">Feira Brasileira de Iniciação Ciêntifica</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link to="/auth/login">Entrar</Link>
            </Button>
            <Button variant="gradient" asChild>
              <Link to="/auth/register">Começar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            Gestão Completa de Feira de Ciências
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Gerencie Sua Feira de Ciências
            <br />
            Do Início ao Fim
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Plataforma web completa para gerenciar todo o ciclo da feira de ciências - desde o registro e submissão de projetos até a avaliação e cerimônia de premiação.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="gradient" asChild>
              <Link to="/auth/register" className="flex items-center gap-2">
                Iniciar Sua Feira <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/auth/login">Acessar Painel</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Tudo Que Você Precisa
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ferramentas e recursos abrangentes projetados especificamente para gestão de feiras de ciências
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-hero border-0 text-center p-12">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary-foreground mb-4">
                Pronto Para Transformar Sua Feira de Ciências?
              </CardTitle>
              <CardDescription className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Junte-se a milhares de educadores e administradores que confiam na FEBIC para gerenciar suas feiras de ciências de forma eficiente e profissional.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link to="/auth/register" className="flex items-center gap-2">
                    Criar Conta <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
                  <Link to="/auth/login">Entrar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={febicLogo} alt="FEBIC" className="h-8 w-auto" />
            <span className="text-lg font-bold text-foreground">FEBIC</span>
          </div>
          <p className="text-muted-foreground">
            © 2025 FEBIC. Todos os direitos reservados. Feira Brasileira de Iniciação Ciêntifica.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;