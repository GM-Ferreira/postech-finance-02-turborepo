"use client";

import { SharedHeader, LoadingOverlay } from "@repo/ui";
import { useSharedHeaderData } from "@/hooks/useSharedHeaderData";
import { LoginModal } from "@/components/modals/LoginModal";
import { SignUpModal } from "@/components/modals/SignUpModal";

const Header = () => {
  const headerData = useSharedHeaderData();

  return (
    <>
      <SharedHeader
        {...headerData}
        LoginModal={LoginModal}
        SignUpModal={SignUpModal}
        logoHref="/home"
      />

      <LoadingOverlay
        isVisible={headerData.isLoggingOut || false}
        message="Saindo da conta..."
        submessage="Sincronizando dados entre aplicativos"
      />
    </>
  );
};

export default Header;
