import Image from "next/image";
import React from "react";
import hzImage from "../../public/images/hz.png";

export default function Page() {
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
              مــــن
            </h3>
            <h3 className="text-xl md:text-2xl lg:text-4xl font-bold text-white mt-4">
              نحـــــــــــــن
            </h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-12 space-y-6">
        <h3 className="text-xl md:text-2xl lg:text-5xl font-bold text-primary text-right">
          قبيلة ال العبد الحباب
        </h3>
        <p className=" text-lg md:text-xl lg:text-2xl text-white text-right leading-6 whitespace-pre-wrap">
          {`
قبيلة آل العبد هي إحدى قبائل الحباب من قحطان، وهي قبيلة عريقة عُرفت منذ القدم بالكرم والشجاعة ونبل الأخلاق، وتمسكت  بالعادات العربية

الأصيلة قولًا وفعلًا، فكان لها حضورها المميز ومكانتها المرموقة بين قبائل قحطان وسائر القبائل.
 

ينتمي أبناء آل العبد إلى أصل عربي صريح، وقد شتهروا بحسن الجوار، وإغاثة الملهوف، والوفاء بالعهود،  إضافة إلى بأسهم المواقف الصعبة 

في  وهو ما جعل اسمهم حاضرًا في ميادين الشرف والذكر الطيب.


وتنقسم قبيلة آل العبد إلى أربعة فخوذ رئيسية، يجمعها النسب الواحد والولاء المتين، وقد توزعت مساكنهم قديمًا وحديثًا في عدة مواقع،
 
من أبرزها وادي ملاح، ومحافظة الأمواة، وجبال السود، وهجرة قرى.ومع اتساع رقعة الاستقرار والتنقل، سكن عدد من أبناء القبيلة في صبحاء


والمزاحمية والخرج، كما امتد وجودهم إلى دول الخليج العربي، خاصة قطر والإمارات.

وقد عُرف عن قبيلة آل العبد علاقتهم الطيبة وتاريخهم المشرف مع حكام الخليج، القائم على الولاء والصدق وحسن السيرة.


  ولا يزال أبناء قبيلة آل العبد إلى اليوم محافظين على إرثهم القبل وتاريخهم المجيد.
 
`}
        </p>
      </div>
    </div>
  );
}
