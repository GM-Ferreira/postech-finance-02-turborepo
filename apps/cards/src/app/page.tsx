"use client";

import Link from "next/link";

import CardsHeader from "@/components/layout/Header";

// Componente de navegação temporário (depois será movido para packages/ui)
const NavigationSection = () => {
  const navLinks = [
    { href: "/home", label: "Início" },
    { href: "/investments", label: "Investimentos" },
    { href: "/cards", label: "Cartões" },
  ];

  return (
    <nav className="w-full flex flex-row justify-around items-center py-4 lg:flex-col lg:justify-start lg:items-stretch lg:bg-[#f5f5f5] lg:p-6 lg:rounded-lg lg:gap-2 lg:max-w-44">
      {navLinks.map((link) => {
        const isActive = link.href === "/cards";

        if (link.href !== "/cards") {
          return (
            <a
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-4 py-3 transition-colors self-center ${!isActive ? "md:hover:bg-gray-200 hover:bg-green-500/50" : ""}`}
            >
              <span
                className={`font-semibold ${isActive ? "text-green-600 border-b-2 border-green-600" : "text-black"}`}
              >
                {link.label}
              </span>
            </a>
          );
        }
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-lg px-4 py-3 transition-colors self-center ${!isActive ? "md:hover:bg-gray-200 hover:bg-green-500/50" : ""}`}
          >
            <span
              className={`font-semibold ${isActive ? "text-green-600 border-b-2 border-green-600" : "text-black"}`}
            >
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default function CardsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CardsHeader />

      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
            {/* // TODO -  Conteúdo navegação de teste */}
            <NavigationSection />

            {/* // TODO -  Conteúdo Principal de teste */}
            <main className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800">Meus Cartões</h1>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
