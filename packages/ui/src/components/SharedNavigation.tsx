"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { UrlUtils } from "../utils/urls";

export const SharedNavigation = () => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/home", label: "Início", app: "home" as const },
    { href: "/cards", label: "Cartões", app: "home" as const },
    {
      href: "/investments",
      label: "Investimentos",
      app: "investments" as const,
    },
  ];

  const isInInvestmentsApp =
    pathname === "/" || pathname.startsWith("/investments");

  const isCrossAppNavigation = (linkHref: string) => {
    if (isInInvestmentsApp) {
      return linkHref === "/home" || linkHref === "/cards";
    } else {
      return linkHref === "/investments";
    }
  };

  const getNavigationUrl = (link: (typeof navLinks)[0]) => {
    if (!isCrossAppNavigation(link.href)) {
      return link.href;
    }

    const baseUrl = UrlUtils.getAppUrl(link.app);

    if (link.app === "investments") {
      return UrlUtils.isProduction() ? baseUrl : `${baseUrl}/investments`;
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
          isInInvestmentsApp && link.href === "/investments"
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
