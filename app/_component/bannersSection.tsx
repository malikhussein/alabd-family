'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import useBannerStore from '../store/banner';

export default function BannersSection() {
  const { banners, loading: bannersLoading, fetchBanners } = useBannerStore();

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 primary-foreground">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-amber-400 mb-6">
          شيوخها ورجالاتها
        </h2>
        <p className="text-3xl  leading-relaxed text-gray-200 max-w-4xl mx-auto">
          هي إحدى قبائل الحباب من قحطان، وهي قبيلة عريقة عُرفت منذ القدم بالكرم
          والشجاعة ونبل الأخلاق
        </p>
      </div>

      {/* Sheikhs Cards Grid */}
      {bannersLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-xl">جاري التحميل...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-xl">لا توجد بنرات حالياً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8  mx-auto">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="group relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-64 md:h-72 lg:h-120 border-2 border-amber-400">
                <Image
                  className="object-cover"
                  src={banner.imageUrl}
                  alt={banner.text}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-amber-400 mb-2">
                    {banner.text}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
