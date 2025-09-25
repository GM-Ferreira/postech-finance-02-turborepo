"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useAuth } from "@/hooks/useAuth";

import bannerSignUp from "@/assets/banners/banner-signup.png";
import { RegistrationService } from "@/services/RegistrationService";
import { Modal } from "@repo/ui/Modal";
import { Input } from "@repo/ui/Input";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
}: SignUpModalProps) => {
  const router = useRouter();
  const { login } = useAuth();
  const registrationService = useMemo(() => new RegistrationService(), []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState(registrationService.user);
  const [isTermsChecked, setIsTermsChecked] = useState(
    registrationService.termsAccepted
  );

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await registrationService.submit();

      login(newUser);

      alert(`Conta para ${newUser.name} criada com sucesso!`);
      onClose();

      router.replace("/home");
    } catch (err: unknown) {
      console.error("Erro no cadastro:", err);

      let errorMessage = "Não foi possível criar a conta. Tente novamente.";

      if (typeof err === "object" && err !== null && "message" in err) {
        errorMessage = String((err as { message: unknown }).message);
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center h-full px-6">
        <div className="max-w-96 mb-8">
          <Image
            src={bannerSignUp}
            alt="Banner convidativo para cadastrar uma conta"
            className="object-contain"
            priority
          />
        </div>

        <p className="text-black text-xl font-bold">
          Preencha os campos abaixo para criar sua conta corrente!
        </p>

        <form className="mt-6 w-full text-left" onSubmit={handleSignUp}>
          <label className="block">
            <span className="text-black font-bold text-base">Nome</span>
            <Input
              type="text"
              placeholder="Digite seu nome completo"
              value={newUser.name}
              onChange={(e) =>
                registrationService.updateField(
                  "name",
                  e.target.value,
                  setNewUser
                )
              }
            />
          </label>

          <label className="mt-4 block">
            <span className="text-black font-bold text-base">Email</span>
            <Input
              type="email"
              placeholder="Digite seu email"
              value={newUser.email}
              onChange={(e) =>
                registrationService.updateField(
                  "email",
                  e.target.value,
                  setNewUser
                )
              }
            />
          </label>

          <label className="mt-4 block">
            <span className="text-black font-bold text-base">Senha</span>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              value={newUser.password}
              onChange={(e) =>
                registrationService.updateField(
                  "password",
                  e.target.value,
                  setNewUser
                )
              }
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="text-zinc-500 hover:text-zinc-700 ml-1 cursor-pointer"
            >
              Mostrar senha
            </span>
          </label>

          <label className="mt-4 flex py-3 flex-row items-center cursor-pointer">
            <div className="w-[24px] h-[24px] flex-shrink-0">
              <input
                type="checkbox"
                className="w-full h-full"
                checked={isTermsChecked}
                onChange={() =>
                  registrationService.toggleTerms(setIsTermsChecked)
                }
              />
            </div>
            <p className="text-zinc-500 ml-4">
              Li e estou ciente quanto às condições de tratamento dos meus dados
              conforme descrito na Política de Privacidade do banco.
            </p>
          </label>

          {error && <p className="mt-4 text-center text-warning">{error}</p>}

          <div className="flex w-full justify-center p-4 mt-4">
            <button
              type="submit"
              className="w-36 h-12 rounded-md bg-warning py-2 text-white hover:bg-warning transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isTermsChecked || isLoading}
            >
              {isLoading ? "Criando..." : "Criar conta"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
