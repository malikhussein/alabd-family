'use client';
import React from 'react';
import Image from 'next/image';
import useFamilyDataStore from '../store/family-data';
import banner3Image from '../../public/images/Frame 8.png';
import { redirect } from 'next/navigation';

export default function FamilySection() {
  const { familiesData, fetchFamilyData } = useFamilyDataStore();

  React.useEffect(() => {
    fetchFamilyData();
  }, [fetchFamilyData]);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-amber-400 mb-6">
          أقسام القبيلة وفروعها
        </h2>
        <p className="text-base md:text-lg lg:text-3xl leading-relaxed text-gray-200 max-w-4xl mx-auto">
          هي إحدى قبائل الحباب من قحطان، وهي قبيلة عريقة عُرفت منذ القدم بالكرم
          والشجاعة ونبل الأخلاق
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mx-auto">
        {familiesData
          ?.slice()
          .reverse()
          .map((family, index) => (
            <div
              key={family.id || index}
              onClick={() => redirect(`/family/${family.id}`)}
              className="group relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              <div className="relative h-64 md:h-72 lg:h-80">
                <Image
                  className="object-cover"
                  src={banner3Image}
                  alt={family.familyName || 'اسم العائلة'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div
                  className={`absolute inset-0 ${
                    index % 2 === 0
                      ? 'bg-[#B1771F]/50'
                      : 'bg-linear-to-t from-black/80 via-black/40 to-transparent'
                  }`}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-400 mb-2">
                    {family.familyName?.split(' ')[0] || 'اسم العائلة'}
                  </h3>
                  <p className="text-base md:text-lg text-gray-200">
                    {family.familyName?.split(' ').slice(1).join(' ') ||
                      'ابن العبد'}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
