"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";

import { LogoIcon, AvatarIcon } from "../icons";
import { LoginModal } from "@/components/modals/LoginModal";
import { SignUpModal } from "@/components/modals/SignUpModal";

type LoggedInViewProps = {
  user: { name: string };
  onLogout: () => void;
};

type LoggedOutViewProps = {
  onLogin: () => void;
  onSignUp: () => void;
};

const LoggedInView: React.FC<LoggedInViewProps> = ({ user, onLogout }) => (
  <>
    <div className="flex items-center space-x-2">
      <span className="font-semibold text-white">{user.name}</span>
      <AvatarIcon className="text-warning" />
    </div>
    <button
      onClick={onLogout}
      className="text-white px-4 py-2 rounded-md border-2 border-primary hover:border-warning transition-colors"
    >
      Sair
    </button>
  </>
);

const LoggedOutView: React.FC<LoggedOutViewProps> = ({ onLogin, onSignUp }) => (
  <>
    <button
      onClick={onSignUp}
      className="text-primary bg-secondary opacity-80 hover:opacity-100 px-4 py-2 rounded-md border-2"
    >
      Abrir minha conta
    </button>
    <button
      onClick={onLogin}
      className="text-white px-4 py-2 rounded-md border-2 border-primary hover:border-white transition-colors"
    >
      Já tenho conta
    </button>
  </>
);

const Header = () => {
  const { isLoggedIn, logout, currentUser } = useAuth();

  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className="bg-primary shadow-md">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <Link href="/home">
          <LogoIcon className="text-white" />
        </Link>

        <div className="flex items-center space-x-4">
          {isClient ? (
            isLoggedIn && currentUser ? (
              <LoggedInView user={currentUser} onLogout={logout} />
            ) : (
              <LoggedOutView
                onLogin={() => setIsLoginModalOpen(true)}
                onSignUp={() => setIsSignUpModalOpen(true)}
              />
            )
          ) : (
            <div style={{ height: "44px", width: "250px" }} />
          )}
        </div>
      </nav>

      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
};

export default Header;
