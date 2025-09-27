"use client";

import { SharedHeader } from "@repo/ui";
import { useSharedHeaderData } from "@/hooks/useSharedHeaderData";
import { LoginModal } from "@/components/modals/LoginModal";
import { SignUpModal } from "@/components/modals/SignUpModal";

const Header = () => {
  const headerData = useSharedHeaderData();

  return (
    <SharedHeader
      {...headerData}
      LoginModal={LoginModal}
      SignUpModal={SignUpModal}
      logoHref="/home"
    />
  );
};

export default Header;
