"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploadProps {
  onImageSelect: (base64: string | null) => void;
  value?: string | null;
  className?: string;
  disabled?: boolean;
}

export const ImageUpload = ({
  onImageSelect,
  value,
  className = "",
  disabled = false,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Apenas arquivos JPG e PNG são permitidos.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "O arquivo deve ter no máximo 1MB.";
    }

    return null;
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Erro ao converter arquivo"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError(null);
    setIsProcessing(true);

    try {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      const base64 = await convertToBase64(file);
      setPreview(base64);
      onImageSelect(base64);
    } catch (err) {
      setError("Erro ao processar o arquivo. Tente novamente.");
      console.error("Erro no upload:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isProcessing}
      />

      {preview ? (
        <div className="relative">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Image
                  src={preview}
                  alt="Preview do anexo"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  📎 Comprovante anexado
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="flex-shrink-0 text-red-600 hover:text-red-800 disabled:opacity-50"
                title="Remover anexo"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={handleButtonClick}
          className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer
            hover:border-gray-400 transition-colors
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${isProcessing ? "bg-gray-50" : "bg-white hover:bg-gray-50"}`}
        >
          {isProcessing ? (
            <div className="space-y-2">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-sm text-gray-600">Processando imagem...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-3xl">📎</div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Clique para anexar comprovante
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG até 1MB (opcional)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </p>
      )}
    </div>
  );
};
