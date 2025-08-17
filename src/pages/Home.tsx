import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  Award,
  Users,
  FileText,
  Download,
  ArrowRight,
  Star,
  BookOpen,
  Trophy,
  ImageIcon,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";
import febicLogo from "@/assets/febic-logo.png";

const Home = () => {
  const scheduleItems = [
    { date: "15/03/2025", event: "Abertura das Inscrições", status: "upcoming" },
    { date: "30/04/2025", event: "Encerramento das Inscrições", status: "upcoming" },
    { date: "15/05/2025", event: "Divulgação dos Selecionados", status: "upcoming" },
    { date: "01/06/2025", event: "Etapa Virtual", status: "upcoming" },
    { date: "15/07/2025", event: "Etapa Presencial", status: "upcoming" },
  ];

  const newsItems = [
    {
      title: "FEBIC 2025: Inscrições Abertas",
      description: "Estão abertas as inscrições para a FEBIC 2025. Participe da maior feira de iniciação científica do Brasil.",
      date: "15 Mar 2025",
      image: "/placeholder.svg"
    },
    {
      title: "Novos Critérios de Avaliação",
      description: "Confira os novos critérios de avaliação para projetos da FEBIC 2025.",
      date: "10 Mar 2025",
      image: "/placeholder.svg"
    },
    {
      title: "Premiações FEBIC 2024",
      description: "Veja os ganhadores e projetos premiados da edição anterior.",
      date: "05 Mar 2025",
      image: "/placeholder.svg"
    }
  ];

  const galleryImages = [
    "/placeholder.svg",
    "/placeholder.svg", 
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg"
  ];

  const awards = [
    { name: "Prêmio de Excelência", icon: Trophy, color: "text-yellow-500" },
    { name: "Inovação Tecnológica", icon: Star, color: "text-blue-500" },
    { name: "Sustentabilidade", icon: Award, color: "text-green-500" },
    { name: "Inclusão Social", icon: Users, color: "text-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={febicLogo} alt="FEBIC Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold">FEBIC 2025</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary">Início</Link>
            <Link to="#sobre" className="text-sm font-medium hover:text-primary">Sobre</Link>
            <Link to="#cronograma" className="text-sm font-medium hover:text-primary">Cronograma</Link>
            <Link to="#regulamento" className="text-sm font-medium hover:text-primary">Regulamento</Link>
            <Link to="#noticias" className="text-sm font-medium hover:text-primary">Notícias</Link>
            <Link to="#contato" className="text-sm font-medium hover:text-primary">Contato</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth/login">Entrar</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/auth/register">Inscrever-se</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">
                FEBIC 2025
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Feira Brasileira de 
                <span className="text-primary"> Iniciação Científica</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Promovendo a educação científica e a inovação através da pesquisa. 
                Participe da maior feira de iniciação científica do Brasil.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group" asChild>
                <Link to="/auth/register">
                  Inscrever Projeto
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="#sobre">
                  Saiba Mais
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">700+</div>
                <div className="text-sm text-muted-foreground">Projetos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">450+</div>
                <div className="text-sm text-muted-foreground">Finalistas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">26</div>
                <div className="text-sm text-muted-foreground">Estados</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="/placeholder.svg" 
              alt="FEBIC Hero Image" 
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">O que é a FEBIC?</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A Feira Brasileira de Iniciação Científica é um evento dedicado ao fomento 
              da pesquisa científica entre estudantes de todos os níveis educacionais.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/placeholder.svg" 
                alt="Sobre FEBIC" 
                className="w-full h-auto rounded-xl shadow-lg"
              />
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Nossos Objetivos</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                    <span>Incentivar o interesse pela pesquisa científica</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                    <span>Promover a interdisciplinaridade e transversalidade</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                    <span>Estimular a inovação e sustentabilidade</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                    <span>Popularizar a ciência na sociedade</span>
                  </li>
                </ul>
              </div>
              
              <Button asChild>
                <Link to="/auth/register">
                  Participar da FEBIC
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="cronograma" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Cronograma FEBIC 2025</h2>
            <p className="text-lg text-muted-foreground">
              Fique por dentro de todas as datas importantes do evento
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {scheduleItems.map((item, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <h3 className="font-semibold">{item.event}</h3>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Em breve</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Regulation Section */}
      <section id="regulamento" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Regulamento</h2>
            <p className="text-lg text-muted-foreground">
              Confira todas as informações e documentos necessários
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Regulamento Geral</CardTitle>
                <CardDescription>
                  Documento completo com todas as regras e diretrizes da FEBIC 2025
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Manual do Participante</CardTitle>
                <CardDescription>
                  Guia prático para participantes com dicas e orientações importantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Critérios de Avaliação</CardTitle>
                <CardDescription>
                  Saiba como os projetos serão avaliados em cada categoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="noticias" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Últimas Notícias</h2>
            <p className="text-lg text-muted-foreground">
              Fique atualizado com as novidades da FEBIC
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((news, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="aspect-video">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="text-sm text-muted-foreground mb-2">{news.date}</div>
                  <CardTitle className="line-clamp-2">{news.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {news.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="p-0">
                    Ler mais
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Galeria de Fotos</h2>
            <p className="text-lg text-muted-foreground">
              Momentos especiais das edições anteriores da FEBIC
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg aspect-square">
                <img 
                  src={image} 
                  alt={`Galeria ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Prêmios e Reconhecimentos</h2>
            <p className="text-lg text-muted-foreground">
              Conheça as categorias de premiação da FEBIC
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <award.icon className={`w-6 h-6 ${award.color}`} />
                  </div>
                  <CardTitle className="text-lg">{award.name}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Annals Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Anais FEBIC</h2>
            <p className="text-lg text-muted-foreground">
              Acesse os trabalhos publicados nas edições anteriores
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[2024, 2023, 2022].map((year) => (
              <Card key={year} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>Anais FEBIC {year}</CardTitle>
                  <CardDescription>
                    Trabalhos publicados na edição de {year}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Acessar Anais
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src={febicLogo} alt="FEBIC Logo" className="h-8 w-auto" />
                <span className="font-bold">FEBIC</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Feira Brasileira de Iniciação Científica - Promovendo a educação científica no Brasil.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Links Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="#sobre" className="text-muted-foreground hover:text-primary">Sobre</Link></li>
                <li><Link to="#cronograma" className="text-muted-foreground hover:text-primary">Cronograma</Link></li>
                <li><Link to="#regulamento" className="text-muted-foreground hover:text-primary">Regulamento</Link></li>
                <li><Link to="#noticias" className="text-muted-foreground hover:text-primary">Notícias</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Participação</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/auth/register" className="text-muted-foreground hover:text-primary">Inscrever Projeto</Link></li>
                <li><Link to="/auth/login" className="text-muted-foreground hover:text-primary">Área do Participante</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-primary">Manual do Avaliador</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-primary">Feiras Afiliadas</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Contato</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>contato@febic.com.br</li>
                <li>(47) 99999-9999</li>
                <li>Jaraguá do Sul - SC</li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 FEBIC - Feira Brasileira de Iniciação Científica. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;