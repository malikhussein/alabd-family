import Image from 'next/image';
import { auth } from '../auth';
import { redirect } from 'next/navigation';
import bannerImage from '../public/images/Frame.png';
import banner2Image from '../public/images/Frame 12.png';
import banner3Image from '../public/images/Frame 8.png';
import BannersSection from './_component/bannersSection';

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner Section */}
      <div className="container mx-auto relative w-full h-[250px] sm:h-[400px] md:h-[600px] lg:h-[779px]">
        <Image
          className="object-cover"
          src={bannerImage}
          alt="قبيلة ال العبد الحباب"
          fill
          priority
        />
      </div>

      {/* Main Introduction Section */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20">
        <div className="flex flex-col lg:flex-row-reverse items-center justify-between gap-6 sm:gap-8 lg:gap-12">
          {/* Text Content - Right Side */}
          <div className="w-full lg:w-1/2 text-right">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-amber-400">
              قبيلة آل العبد الحباب
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl leading-relaxed text-gray-200">
              هي إحدى قبائل الحباب من قحطان، وهي قبيلة عريقة عُرفت منذ القدم
              بالكرم والشجاعة ونبل الأخلاق، وتمسكت بالعادات العربية الأصيلة
              قولًا وفعلًا، فكان لها حضورها المميز ومكانتها المرموقة بين قبائل
              قحطان وسائر القبائل، فكان لها حضورها المميز ومكانتها المرموقة.
            </p>
          </div>

          {/* Image - Left Side */}
          <div className="w-full lg:w-1/3">
            <div className="relative overflow-hidden shadow-2xl h-[250px] sm:h-[350px] md:h-[500px]">
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
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-amber-400 mb-4 sm:mb-6">
            أقسام القبيلة وفروعها
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl leading-relaxed text-gray-200 max-w-4xl mx-auto px-2">
            هي إحدى قبائل الحباب من قحطان، وهي قبيلة عريقة عُرفت منذ القدم
            بالكرم والشجاعة ونبل الأخلاق
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mx-auto">
          {/* Card 1 */}
          <div className="group relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="relative h-56 sm:h-64 md:h-72 lg:h-80">
              <Image
                className="object-cover"
                src={banner3Image}
                alt="يحيى ابن رشيد ابن العبد"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-[#B1771F]/65" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-amber-400 mb-1 sm:mb-2">
                  الحاف
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-200">
                  ابن غانم ابن العبد
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="relative h-56 sm:h-64 md:h-72 lg:h-80">
              <Image
                className="object-cover"
                src={banner3Image}
                alt="برغش ابن راشد ابن العبد"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-amber-400 mb-1 sm:mb-2">
                  برقع
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-200">
                  ابن غانم ابن العبد
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="relative h-56 sm:h-64 md:h-72 lg:h-80">
              <Image
                className="object-cover"
                src={banner3Image}
                alt="محمد ابن راشد ابن العبد"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-[#B1771F]/65" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-amber-400 mb-1 sm:mb-2">
                  فايع
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-200">
                  ابن رشيد ابن العبد
                </p>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="group relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
            <div className="relative h-56 sm:h-64 md:h-72 lg:h-80">
              <Image
                className="object-cover"
                src={banner3Image}
                alt="محمد ابن راشد ابن العبد"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-center">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-amber-400 mb-1 sm:mb-2">
                  محمد
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-200">
                  ابن رشيد ابن العبد
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sheikhs and Notable Figures Section */}
      <BannersSection />

      {/* Footer Spacing */}
      <div className="h-12 sm:h-16 md:h-20"></div>
    </div>
  );
}