import React from "react";
import hzImage from "../../public/images/hz.png";
import cardImage from "../../public/images/Container.png";
import Image from "next/image";

export default function page() {
  const cards = [
    { title: "شاعت شوايع ال العبد" },
    { title: "ابن عباد اني ولد عباد" },
    { title: "معشية عزام" },
    { title: "بلال الريق ابد العبد" },
    { title: "زبن المجنا ابن العبد" },
    { title: "سقم الحريب ابن العبد" },
    { title: "صبي الملاحيق ابن العبد" },
    { title: "طروش الموت" },
    { title: "ذباحة الشيوخ" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] overflow-x-hidden" dir="rtl">

      {/* Banner */}
      
      <div className="relative w-full flex flex-col items-center justify-center px-4 py-10 sm:py-16 md:py-20 overflow-hidden">

        {/* Background decorative image */}
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
          <Image
            src={hzImage}
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Banner text */}
        <div className="relative z-10 text-center mb-12 sm:mb-8 mt-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-400 tracking-widest leading-tight">
            القـــاب وعـــزاوي
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white mt-12 tracking-wider">
            ال العبد
          </h2>
        </div>

        {/* Banner card image */}
        {/* <div className="relative z-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <Image
            src={cardImage}
            alt="Container"
            width={600}
            height={400}
            className="w-full h-auto object-contain rounded-2xl shadow-2xl shadow-amber-900/30"
          />
        </div> */}
      </div>

      {/* Divider */}
      <div className="w-full px-4 sm:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
      </div>

      {/* Cards Grid */}
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-16 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-5xl mx-auto">
          {cards.map((card, index) => (
            <div
              key={index}
              className="
                relative group flex items-center justify-center
                bg-gradient-to-br from-[#1a1409] to-[#0f0d07]
                border border-amber-800/40 hover:border-amber-500/70
                rounded-xl sm:rounded-2xl
                px-4 py-5 sm:px-6 sm:py-6
                text-center cursor-default
                transition-all duration-300
                hover:shadow-lg hover:shadow-amber-900/40
                hover:-translate-y-1
                overflow-hidden
              "
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />

              <p className="relative z-10 text-amber-100 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                {card?.title}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}