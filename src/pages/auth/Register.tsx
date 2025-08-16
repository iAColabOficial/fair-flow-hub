import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Info, User, GraduationCap, MapPin } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { AuthLayout } from "./AuthLayout";
import { formatCPF, formatPhone } from "@/lib/utils";

type FebicRole = 'autor' | 'orientador' | 'coorientador' | 'avaliador' | 'admin_staff' | 'coordenador_admin' | 'coordenador' | 'diretor' | 'financeiro' | 'feira_afiliada' | 'voluntario';

const roleOptions: { value: FebicRole; label: string; description: string; needsApproval: boolean }[] = [
  { 
    value: 'autor', 
    label: 'Autor/Estudante', 
    description: 'Submete projetos científicos para a feira',
    needsApproval: false 
  },
  { 
    value: 'orientador', 
    label: 'Orientador/Professor', 
    description: 'Orienta projetos de estudantes',
    needsApproval: false 
  },
  { 
    value: 'admin_staff', 
    label: 'Administrador', 
    description: 'Acesso administrativo completo ao sistema',
    needsApproval: false 
  },
];

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Dados básicos (Passo 1)
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    cpf: "",
    phone: "",
    role: "" as FebicRole | "",
    
    // Dados pessoais (Passo 2) 
    data_nascimento: "",
    endereco_completo: "",
    
    // Dados acadêmicos (Passo 3)
    instituicao: "",
    nivel_escolar: "",
    formacao_academica: "",
    area_atuacao: "",
    curriculo_lattes: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp, loading } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Aplicar formatação em tempo real
    let formattedValue = value;
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.cpf || !formData.phone || !formData.role) {
      alert("Preencha todos os campos obrigatórios");
      return false;
    }
    if (formData.password.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.data_nascimento || !formData.endereco_completo) {
      alert("Preencha todos os campos obrigatórios");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.instituicao || !formData.nivel_escolar) {
      alert("Preencha todos os campos obrigatórios");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep3()) return;

    // Remover formatação do CPF para salvar apenas números
    const cleanCPF = formData.cpf.replace(/\D/g, '');
    const cleanPhone = formData.phone.replace(/\D/g, '');

    await signUp(formData.email, formData.password, {
      full_name: formData.fullName,
      cpf: cleanCPF,
      phone: cleanPhone,
      role: formData.role,
      data_nascimento: formData.data_nascimento,
      endereco_completo: formData.endereco_completo,
      instituicao: formData.instituicao,
      nivel_escolar: formData.nivel_escolar,
      formacao_academica: formData.formacao_academica,
      area_atuacao: formData.area_atuacao,
      curriculo_lattes: formData.curriculo_lattes,
    });
  };

  const selectedRole = roleOptions.find(role => role.value === formData.role);

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Dados Básicos</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Nome Completo *</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="Seu nome completo"
          value={formData.fullName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            name="cpf"
            type="text"
            placeholder="000.000.000-00"
            value={formData.cpf}
            onChange={handleInputChange}
            maxLength={14}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            value={formData.phone}
            onChange={handleInputChange}
            maxLength={15}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Tipo de Usuário *</Label>
        <Select value={formData.role} onValueChange={(value: FebicRole) => handleSelectChange('role', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione seu tipo de usuário" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                <div className="flex flex-col">
                  <span className="font-medium">{role.label}</span>
                  <span className="text-xs text-muted-foreground">{role.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedRole && selectedRole.needsApproval && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Este tipo de usuário requer aprovação do administrador antes de ter acesso completo ao sistema.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha *</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Digite a senha novamente"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Informações Pessoais</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
        <Input
          id="data_nascimento"
          name="data_nascimento"
          type="date"
          value={formData.data_nascimento}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endereco_completo">Endereço Completo *</Label>
        <Textarea
          id="endereco_completo"
          name="endereco_completo"
          placeholder="Rua, número, bairro, cidade, estado, CEP"
          value={formData.endereco_completo}
          onChange={handleInputChange}
          rows={3}
          required
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Informações Acadêmicas</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instituicao">Instituição *</Label>
        <Input
          id="instituicao"
          name="instituicao"
          type="text"
          placeholder="Nome da escola, universidade ou instituição"
          value={formData.instituicao}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nivel_escolar">Nível Escolar *</Label>
        <Select value={formData.nivel_escolar} onValueChange={(value) => handleSelectChange('nivel_escolar', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione seu nível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="educacao_infantil">Educação Infantil</SelectItem>
            <SelectItem value="ensino_fundamental_i">Ensino Fundamental I</SelectItem>
            <SelectItem value="ensino_fundamental_ii">Ensino Fundamental II</SelectItem>
            <SelectItem value="ensino_medio">Ensino Médio</SelectItem>
            <SelectItem value="ensino_tecnico">Ensino Técnico</SelectItem>
            <SelectItem value="ensino_superior">Ensino Superior</SelectItem>
            <SelectItem value="pos_graduacao_lato">Pós-graduação Lato Sensu</SelectItem>
            <SelectItem value="pos_graduacao_stricto">Pós-graduação Stricto Sensu</SelectItem>
            <SelectItem value="outros">Outros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="formacao_academica">Formação Acadêmica</Label>
        <Input
          id="formacao_academica"
          name="formacao_academica"
          type="text"
          placeholder="Ex: Licenciatura em Biologia"
          value={formData.formacao_academica}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="area_atuacao">Área de Atuação</Label>
        <Input
          id="area_atuacao"
          name="area_atuacao"
          type="text"
          placeholder="Ex: Ciências da Natureza"
          value={formData.area_atuacao}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="curriculo_lattes">Currículo Lattes (URL)</Label>
        <Input
          id="curriculo_lattes"
          name="curriculo_lattes"
          type="url"
          placeholder="http://lattes.cnpq.br/..."
          value={formData.curriculo_lattes}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );

  return (
    <AuthLayout>
      <Card className="border-0 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
          <CardDescription>
            Cadastre-se para participar da FEBIC (Passo {currentStep} de 3)
          </CardDescription>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            <div className="flex justify-between gap-4">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Voltar
                </Button>
              )}
              
              {currentStep < 3 ? (
                <Button type="button" onClick={nextStep} className="ml-auto">
                  Próximo
                </Button>
              ) : (
                <Button type="submit" className="ml-auto" disabled={loading}>
                  {loading ? "Criando conta..." : "Criar Conta"}
                </Button>
              )}
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/auth/login" className="text-primary hover:underline font-medium">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-center">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao início
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;
