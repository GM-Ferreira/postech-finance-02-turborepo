"use client";

import { useState } from "react";
import Link from "next/link";

export default function CardsUnavailable() {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      await fetch('http://localhost:3001/cards', { 
        method: 'HEAD',
        mode: 'no-cors' 
      });
      
      window.location.href = '/cards';
    } catch {
      setTimeout(() => {
        setIsRetrying(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 6.5c-.77.833-.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Serviço Temporariamente Indisponível
        </h1>

        <p className="text-gray-600 mb-6">
          O módulo de cartões não está disponível no momento. 
          Isso pode acontecer se o serviço não estiver rodando ou houver problemas de conectividade.
        </p>

        {/* Informações técnicas (apenas em desenvolvimento) */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-left">
          <p className="font-semibold text-blue-800 mb-2">Informações técnicas:</p>
          <ul className="text-blue-700 space-y-1">
            <li>• Verifique se o serviço cards está rodando na porta 3001</li>
            <li>• Execute: <code className="bg-blue-100 px-1 rounded">npm run dev</code> na pasta apps/cards</li>
            <li>• Tentativas de reconexão: {retryCount}</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isRetrying 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isRetrying ? 'Tentando...' : 'Tentar Novamente'}
          </button>

          <Link
            href="/home"
            className="px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Voltar ao Início
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Se o problema persistir, entre em contato com o suporte técnico.
        </p>
      </div>
    </div>
  );
}