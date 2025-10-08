"use client";

import { useState } from "react";
import Image from "next/image";

import { Modal } from "@repo/ui";

interface ImageAttachmentViewerProps {
  imageBase64: string;
  isOpen: boolean;
  onClose: () => void;
  transactionType?: string;
}

export const ImageAttachmentViewer = ({
  imageBase64,
  isOpen,
  onClose,
  transactionType = "transação",
}: ImageAttachmentViewerProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageBase64.startsWith("data:image/")) {
      return imageBase64;
    }
    return `data:image/png;base64,${imageBase64}`;
  };

  const downloadImage = () => {
    try {
      const link = document.createElement("a");
      link.href = getImageSrc();
      link.download = `comprovante-${transactionType}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.warn("Erro ao baixar a imagem:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Comprovante da {transactionType}
          </h3>
        </div>

        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg p-4 min-h-[300px]">
          {imageError ? (
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📄</div>
              <p>Erro ao carregar a imagem</p>
              <p className="text-sm">O arquivo pode estar corrompido</p>
            </div>
          ) : (
            <Image
              src={getImageSrc()}
              alt="Comprovante da transação"
              width={800}
              height={600}
              className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm"
              onError={handleImageError}
            />
          )}
        </div>

        <div className="flex gap-3 mt-4 justify-end">
          <button
            onClick={downloadImage}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            disabled={imageError}
          >
            Baixar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
};
