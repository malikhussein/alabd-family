import React from 'react';
import { Heart, Sparkles, User } from 'lucide-react';

export default function SideBar() {
  // Most liked posts data
  const popularPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200&q=80",
      title: "الجيل القديم: رفيق الدرب",
      likes: 1245
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200&q=80",
      title: "الجيل القديم: رفيق الدرب",
      likes: 1245
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200&q=80",
      title: "الجيل القديم: رفيق الدرب",
      likes: 1245
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200&q=80",
      title: "الجيل القديم: رفيق الدرب",
      likes: 1245
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200&q=80",
      title: "الجيل القديم: رفيق الدرب",
      likes: 1245
    }
  ];

  // Most active members data
  const activeMembers = [
    {
      id: 1,
      name: "محمد العتيبي",
      nameEn: "Mohammad Al-Otaibi",
      actions: 198,
      color: "bg-yellow-600"
    },
    {
      id: 2,
      name: "سارة الخليل",
      nameEn: "Sarah Al-Khalil",
      actions: 231,
      color: "bg-gray-600"
    },
    {
      id: 3,
      name: "فهد السالم",
      nameEn: "Fahad Al-Salem",
      actions: 133,
      color: "bg-orange-600"
    },
    {
      id: 4,
      name: "عبدالله الراشد",
      nameEn: "Abdullah Al-Rashid",
      actions: 106,
      color: "bg-gray-700"
    },
    {
      id: 5,
      name: "نورة العتيبي",
      nameEn: "Noura Al-Otaibi",
      actions: 127,
      color: "bg-gray-700"
    },
    {
      id: 6,
      name: "خالد المحربي",
      nameEn: "Khalid Al-Muhrabi",
      actions: 77,
      color: "bg-gray-700"
    }
  ];

  return (
    <div className="w-full py-12 bg-card  p-4 space-y-8">
      {/* Most Liked Posts Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <Heart className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-bold text-white">أخبر المنشورات أيضاً</h2>
        </div>

        <div className="space-y-4">
          {popularPosts.map((post) => (
            <div 
              key={post.id}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden">
                <img 
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <div className="flex-1 text-right">
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {post.title}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-yellow-500 text-sm font-medium">{post.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800"></div>

      {/* Most Active Members Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-bold text-white">الأعضاء الأكثر نشاطاً</h2>
        </div>

        <div className="space-y-4">
          {activeMembers.map((member) => (
            <div 
              key={member.id}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-12 h-12 rounded-full ${member.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <User className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 text-left">
                  <p className="text-xs text-gray-500">{member.nameEn}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-white font-medium mb-1">{member.name}</p>
                <p className="text-xs text-gray-500">{member.actions} Actions</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}