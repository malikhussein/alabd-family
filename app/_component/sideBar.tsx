"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { CardSim, Heart, Sparkles, StickyNote, User } from "lucide-react";
import usePostStore from "../store/post";
import image1 from "../../public/images/image 1.jpg";
import useUserStore from "../store/user";

export default function SideBar() {
  const { fetchPosts, posts } = usePostStore();

  const { users, mostActiveUsers } = useUserStore();

  useEffect(() => {
    fetchPosts();
    mostActiveUsers();
  }, [fetchPosts, mostActiveUsers]);

  // Most liked posts data
  const popularPosts = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200&q=80",
      title: "الجيل القديم: رفيق الدرب",
      likes: 1245,
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200&q=80",
      title: "الجيل القديم: رفيق الدرب",
      likes: 1245,
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200&q=80",
      title: "الجيل القديم: رفيق الدرب",
      likes: 1245,
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200&q=80",
      title: "الجيل القديم: رفيق الدرب",
      likes: 1245,
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200&q=80",
      title: "الجيل القديم: رفيق الدرب",
      likes: 1245,
    },
  ];

  // Most active users data
  const activeusers = [
    {
      id: 1,
      name: "محمد العتيبي",
      nameEn: "Mohammad Al-Otaibi",
      actions: 198,
      color: "bg-yellow-600",
    },
    {
      id: 2,
      name: "سارة الخليل",
      nameEn: "Sarah Al-Khalil",
      actions: 231,
      color: "bg-gray-600",
    },
    {
      id: 3,
      name: "فهد السالم",
      nameEn: "Fahad Al-Salem",
      actions: 133,
      color: "bg-orange-600",
    },
    {
      id: 4,
      name: "عبدالله الراشد",
      nameEn: "Abdullah Al-Rashid",
      actions: 106,
      color: "bg-gray-700",
    },
    {
      id: 5,
      name: "نورة العتيبي",
      nameEn: "Noura Al-Otaibi",
      actions: 127,
      color: "bg-gray-700",
    },
    {
      id: 6,
      name: "خالد المحربي",
      nameEn: "Khalid Al-Muhrabi",
      actions: 77,
      color: "bg-gray-700",
    },
  ];

  return (
    <div className="w-full py-12 bg-card  p-4 space-y-8">
      {/* Most Liked Posts Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <CardSim className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-bold text-white">أخر المنشورات </h2>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden">
                <Image
                  src={post.imageUrl || image1}
                  alt={post.text}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 text-right">
                <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {post.text.length > 50
                    ? "..." + post.text.substring(0, 50)
                    : post.text}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-yellow-500 text-sm font-medium">
                  {post.likes}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800"></div>

      {/* Most Active users Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h2 className="text-lg font-bold text-white">
            الأعضاء الأكثر نشاطاً
          </h2>
        </div>

        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`w-12 h-12 rounded-full  flex items-center justify-center bg-accent`}
                >
                  <User className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 text-left">
                  <p className="text-sm text-white font-medium mb-1">
                    {user.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-300"> {user.role} : الدور</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
