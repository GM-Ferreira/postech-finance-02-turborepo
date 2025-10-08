"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Input } from "@repo/ui/Input";
import { Modal } from "@repo/ui/Modal";

import bannerLogin from "@/assets/banners/banner-login.png";
import { useAuth } from "@/hooks/useAuth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
}: LoginModalProps) => {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (email && password) {
      try {
        const success = await login({ email, password });

        if (success) {
          onClose();
          router.replace("/home");
        } else {
          setError("Credenciais inválidas. Tente novamente.");
        }
      } catch (error) {
        setError("Erro ao fazer login. Tente novamente.");
        console.warn("Login error:", error);
      }
    } else {
      setError("Por favor, preencha ambos os campos.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center">
        <div className="max-w-96 mb-8">
          <Image
            src={bannerLogin}
            alt="Banner convidativo para entrar com sua conta"
            className="object-contain"
            priority
          />
        </div>

        <form className="mt-6 w-full text-left" onSubmit={handleLogin}>
          <label className="block">
            <span className="text-black font-bold text-base">Email</span>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </label>

          <label className="mt-4 block">
            <span className="text-black font-bold text-base">Senha</span>
            <Input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </label>

          {error && <p className="mt-4 text-center text-warning">{error}</p>}

          <div className="flex w-full justify-center p-4 mt-6">
            <button
              type="submit"
              className="w-36 h-12 rounded-md bg-success py-2 text-white
                hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
