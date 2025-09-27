"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { UrlUtils } from "../utils/urls";

export const SharedNavigation = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/home", label: "Início", app: "home" as const },
    { href: "/investments", label: "Investimentos", app: "home" as const },
    { href: "/cards", label: "Cartões", app: "cards" as const },
  ];

  const isInCardsApp = pathname === "/" || pathname.startsWith("/cards");

  const isCrossAppNavigation = (linkHref: string) => {
    if (isInCardsApp) {
      return linkHref === "/home" || linkHref === "/investments";
    } else {
      return linkHref === "/cards";
    }
  };

  const getNavigationUrl = (link: (typeof navLinks)[0]) => {
    if (!isCrossAppNavigation(link.href)) {
      return link.href;
    }

    const baseUrl = UrlUtils.getAppUrl(link.app);

    if (link.app === "cards") {
      return UrlUtils.isProduction() ? baseUrl : `${baseUrl}/cards`;
    }

    return `${baseUrl}${link.href}`;
  };

  return (
    <nav
      className="w-full
        flex flex-row justify-around items-center py-4
        lg:flex-col lg:justify-start lg:items-stretch 
        lg:bg-[#f5f5f5] lg:p-6 lg:rounded-lg lg:gap-2 lg:max-w-44"
    >
      {navLinks.map((link) => {
        const isActive =
          isInCardsApp && link.href === "/cards"
            ? true
            : pathname.startsWith(link.href);

        const needsCrossAppNavigation = isCrossAppNavigation(link.href);

        const commonClasses = `
          block rounded-lg px-4 py-3 transition-colors
          self-center
          ${!isActive ? "md:hover:bg-gray-200 hover:bg-success/50" : ""}
        `;

        const spanClasses = `
          font-semibold
          ${isActive ? "text-success border-b-2 border-success" : "text-black"}
        `;

        if (needsCrossAppNavigation) {
          const navigationUrl = getNavigationUrl(link);
          return (
            <a key={link.label} href={navigationUrl} className={commonClasses}>
              <span className={spanClasses}>{link.label}</span>
            </a>
          );
        }

        return (
          <Link key={link.label} href={link.href} className={commonClasses}>
            <span className={spanClasses}>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
