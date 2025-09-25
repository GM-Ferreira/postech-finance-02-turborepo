import Image from "next/image";

import bannerInfo from "@/assets/banners/banner-01.png";
import bannerAd from "@/assets/banners/banner-02.png";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-11/12 mt-20 flex justify-center">
        <Image
          src={bannerInfo}
          alt="Baner convidativo para a aplicação Bytebank"
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 92vw"
        />
      </div>
      <div className="w-11/12 mt-5 flex justify-center">
        <Image
          src={bannerAd}
          alt="Baner convidativo para a aplicação Bytebank"
          className="object-contain"
        />
      </div>
    </div>
  );
}
