"use client";

import React, { useState } from "react";

import { useHydration } from "../hooks/useHydration";
import { LogoIcon, AvatarIcon } from "../icons";
import "./SharedHeader.css";

export interface SharedHeaderProps {
  isLoggedIn: boolean;
  currentUser: { name: string } | null;
  onLogin: () => void;
  onSignUp: () => void;
  onLogout: () => void;
  logoHref?: string;
  isLoading?: boolean;
  LoginModal?: React.ComponentType<{ isOpen: boolean; onClose: () => void }>;
  SignUpModal?: React.ComponentType<{ isOpen: boolean; onClose: () => void }>;
}

const LoggedInView: React.FC<{
  user: { name: string };
  onLogout: () => void;
}> = ({ user, onLogout }) => (
  <>
    <div className="flex items-center space-x-2">
      <span className="font-semibold text-white">{user.name}</span>
      <AvatarIcon
        className="text-warning"
        size={32}
        style={{ color: "#ff5031" }}
      />
    </div>
    <button
      onClick={onLogout}
      className="text-white px-4 py-2 rounded-md border-2 border-primary hover:border-warning transition-colors"
    >
      Sair
    </button>
  </>
);

const LoggedOutView: React.FC<{
  onLogin: () => void;
  onSignUp: () => void;
}> = ({ onLogin, onSignUp }) => (
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

export const SharedHeader: React.FC<SharedHeaderProps> = ({
  logoHref = "/home",
  isLoggedIn,
  currentUser,
  isLoading = false,
  onLogin,
  onSignUp,
  onLogout,
  LoginModal,
  SignUpModal,
}) => {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const isHydrated = useHydration();

  const handleLogin = () => {
    setIsLoginModalOpen(true);
    onLogin();
  };

  const handleSignUp = () => {
    setIsSignUpModalOpen(true);
    onSignUp();
  };

  return (
    <header className="shared-header bg-primary shadow-md">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <a href={logoHref} className="text-white">
          <LogoIcon className="text-white" />
        </a>

        <div className="flex items-center space-x-4">
          {!isHydrated || isLoading ? (
            <div style={{ height: "44px", width: "250px" }} />
          ) : isLoggedIn && currentUser ? (
            <LoggedInView user={currentUser} onLogout={onLogout} />
          ) : (
            <LoggedOutView onLogin={handleLogin} onSignUp={handleSignUp} />
          )}
        </div>
      </nav>

      {SignUpModal && (
        <SignUpModal
          isOpen={isSignUpModalOpen}
          onClose={() => setIsSignUpModalOpen(false)}
        />
      )}

      {LoginModal && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}
    </header>
  );
};
