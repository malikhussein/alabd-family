import Image from 'next/image';
import bannerImage from '../public/images/Frame.png';
import banner2Image from '../public/images/Frame 12.png';
import BannersSection from './_component/bannersSection';
import FamilySection from './_component/familySection';

export default async function Home() {
  return (
    <div className="min-h-screen  ">
      {/* Hero Banner Section */}
      <div className=" container mx-auto relative w-full h-[300px] md:h-[600px] lg:h-[779px]">
        <Image
          // className="object-cover"
          src={bannerImage}
          alt="قبيلة ال العبد الحباب"
          fill
          priority
        />
      </div>

      {/* Main Introduction Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-8 lg:gap-12">
          {/* Text Content - Right Side */}
          <div className="w-full lg:w-1/2 text-right">
            <h1 className="text-5xl font-bold mb-6 text-amber-400">
              قبيلة آل العبد الحباب
            </h1>
            <p className="text-4xl leading-relaxed text-gray-200">
              هي إحدى قبائل الحباب من قحطان، وهي قبيلة عريقة عُرفت منذ القدم
              بالكرم والشجاعة ونبل الأخلاق، وتمسكت بالعادات العربية الأصيلة
              قولًا وفعلًا، فكان لها حضورها المميز ومكانتها المرموقة بين قبائل
              قحطان وسائر القبائل، فكان لها حضورها المميز ومكانتها المرموقة.
            </p>
          </div>

          {/* Image - Left Side */}
          <div className="w-full lg:w-1/3">
            <div className="relative overflow-hidden shadow-2xl h-[300px] md:h-[500px]">
              <Image
                className="object-cover"
                src={banner2Image}
                alt="صورة القبيلة"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tribe Divisions Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-amber-400 mb-6">
            أقسام القبيلة وفروعها
          </h2>
          <p className="text-base md:text-lg lg:text-3xl leading-relaxed text-gray-200 max-w-4xl mx-auto">
            هي إحدى قبائل الحباب من قحطان، وهي قبيلة عريقة عُرفت منذ القدم
            بالكرم والشجاعة ونبل الأخلاق
          </p>
        </div>

        {/* Cards Grid */}
        <FamilySection />
      </div>

      {/* Sheikhs and Notable Figures Section */}
      <BannersSection />

      {/* Footer Spacing */}
      <div className="h-20"></div>
    </div>
  );
}
