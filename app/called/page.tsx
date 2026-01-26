import React from "react";
import hzImage from "../../public/images/hz.png";
import cardImage from "../../public/images/Container.png";
import Image from "next/image";

export default function page() {
  const cards = [
    {
      title: "شاعت شوايع ال العبد",
    },
    {
      title: "ابن عباد اني ولد عباد",
    },
    {
      title: "معشية عزام ",
    },
    {
      title: "بلال الريق ابد العبد",
    },
    {
      title: "زبن المجنا ابن العبد ",
    },
    {
      title: "سقم الحريب ابن العبد  ",
    },
    {
      title: "صبي الملاحيق ابن العبد",
    },
    {
      title: "طروش الموت ",
    },
    {
      title: " ذباحة الشيوخ",
    },
  ];
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 ">
      {/* Banner -   */}
      <div className="w-full ">
        <div className="relative h-64 md:h-72 lg:h-120 ">
          <Image
            className="object-cover"
            src={hzImage}
            alt="يحيى ابن راشد ابن العبد"
            fill
          />
          <div className="absolute inset-0  bg-[#B1771F]/50" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-center mb-40">
            <h3 className="text-xl md:text-2xl lg:text-4xl font-bold text-white  ">
              القـــاب وعـــزاوي
            </h3>
            <h3 className="text-xl md:text-2xl lg:text-4xl font-bold text-white mt-4">
              ال العبد
            </h3>
          </div>
        </div>
      </div>

      {/* Cards -   */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-card relative rounded-lg overflow-hidden shadow-xl mb-4 hover:shadow-2xl transition-all duration-300 hover:scale-103 mt-12"
          >
            <div className="image  ">
              <Image
                src={cardImage}
                alt={card.title}
                className="w-full h-auto   "
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center mb-35">
              <h2 className="text-3xl font-bold text-white  ">{card?.title}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
