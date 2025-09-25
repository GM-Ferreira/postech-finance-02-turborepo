"use client";

import Link from "next/link";

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

// Componente de cartão temporário
const CardComponent = ({
  title,
  number,
  type,
}: {
  title: string;
  number: string;
  type: string;
}) => (
  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white min-h-[200px] flex flex-col justify-between">
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm opacity-80">{type}</p>
    </div>
    <div>
      <p className="text-xl font-mono tracking-wider">
        {number.replace(/(.{4})/g, "$1 ").trim()}
      </p>
    </div>
  </div>
);

export default function CardsPage() {
  const mockCards = [
    {
      id: 1,
      title: "Cartão Principal",
      number: "1234567812345678",
      type: "Débito",
    },
    {
      id: 2,
      title: "Cartão Crédito",
      number: "8765432187654321",
      type: "Crédito",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
          {/* Navegação */}
          <NavigationSection />

          {/* // TODO -  Conteúdo Principal de teste */}
          <main className="space-y-6">
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Meus Cartões
                </h1>
                <p className="text-gray-600">
                  Gerencie seus cartões de débito e crédito
                </p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockCards.map((card) => (
                <CardComponent
                  key={card.id}
                  title={card.title}
                  number={card.number}
                  type={card.type}
                />
              ))}
            </div>

            {/* Botão para adicionar novo cartão */}
            <div className="flex justify-center pt-6">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors">
                + Adicionar Novo Cartão
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
