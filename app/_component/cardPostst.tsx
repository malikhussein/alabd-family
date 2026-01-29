import React from "react";
import { Heart, MessageCircle, Bookmark } from "lucide-react";

export default function CardPosts() {
  // Sample posts data
  const posts = [
    {
      id: 1,
      image:
        "https://unsplash.com/photos/a-couple-of-horses-stand-near-each-other-JQ5NAYdkpU4",
      title: "فن القهوة العريبة: رمز الكرم",
      subtitle: "القهوة العربية ليست مجرد مشروب",
      description: `  ذالصحراء العربية تحكي قصص الأجداد والتراث العريق، حيث الرمال الذهبية تمتد إلى ما لا نهاية
        الصحراء العربية تحكي قصص الأجداد والتراث العريق، حيث الرمال الذهبية تمتد إلى ما لا نهاية
                الصحراء العربية تحكي قصص الأجداد والتراث العريق، حيث الرمال الذهبية تمتد إلى ما لا نهاية
        الصحراء العربية تحكي قصص الأجداد والتراث العريق، حيث الرمال الذهبية تمتد إلى ما لا نهاية
        `,
      tags: ["Heritage", "Tradition"],
      likes: 892,
      comments: 12,
      timeAgo: "2 HOURS AGO",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1583061093120-e82863dea7e8?w=800&q=80",
      title: "رحلة عبر الصحراء",
      subtitle: "جمال الصحراء العربية",
      description: `  ذالصحراء العربية تحكي قصص الأجداد والتراث العريق، حيث الرمال الذهبية تمتد إلى ما لا نهاية
        الصحراء العربية تحكي قصص الأجداد والتراث العريق، حيث الرمال الذهبية تمتد إلى ما لا نهاية
                الصحراء العربية تحكي قصص الأجداد والتراث العريق، حيث الرمال الذهبية تمتد إلى ما لا نهاية
        الصحراء العربية تحكي قصص الأجداد والتراث العريق، حيث الرمال الذهبية تمتد إلى ما لا نهاية
        `,
      tags: ["Travel", "Desert"],
      likes: 654,
      comments: 23,
      timeAgo: "5 HOURS AGO",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80",
      title: "الخط العربي: فن وإبداع",
      subtitle: "جمالية الحروف العربية",
      description:
        "الخط العربي يمثل أحد أهم الفنون الإسلامية، حيث يجمع بين الجمال والمعنى في تناغم مذهل",
      tags: ["Art", "Culture"],
      likes: 1205,
      comments: 45,
      timeAgo: "1 DAY AGO",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80",
      title: "الخط العربي: فن وإبداع",
      subtitle: "جمالية الحروف العربية",
      description:
        "الخط العربي يمثل أحد أهم الفنون الإسلامية، حيث يجمع بين الجمال والمعنى في تناغم مذهل",
      tags: ["Art", "Culture"],
      likes: 1205,
      comments: 45,
      timeAgo: "1 DAY AGO",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80",
      title: "الخط العربي: فن وإبداع",
      subtitle: "جمالية الحروف العربية",
      description:
        "الخط العربي يمثل أحد أهم الفنون الإسلامية، حيث يجمع بين الجمال والمعنى في تناغم مذهل",
      tags: ["Art", "Culture"],
      likes: 1205,
      comments: 45,
      timeAgo: "1 DAY AGO",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80",
      title: "الخط العربي: فن وإبداع",
      subtitle: "جمالية الحروف العربية",
      description:
        "الخط العربي يمثل أحد أهم الفنون الإسلامية، حيث يجمع بين الجمال والمعنى في تناغم مذهل",
      tags: ["Art", "Culture"],
      likes: 1205,
      comments: 45,
      timeAgo: "1 DAY AGO",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80",
      title: "الخط العربي: فن وإبداع",
      subtitle: "جمالية الحروف العربية",
      description:
        "الخط العربي يمثل أحد أهم الفنون الإسلامية، حيث يجمع بين الجمال والمعنى في تناغم مذهل",
      tags: ["Art", "Culture"],
      likes: 1205,
      comments: 45,
      timeAgo: "1 DAY AGO",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80",
      title: "الخط العربي: فن وإبداع",
      subtitle: "جمالية الحروف العربية",
      description:
        "الخط العربي يمثل أحد أهم الفنون الإسلامية، حيث يجمع بين الجمال والمعنى في تناغم مذهل",
      tags: ["Art", "Culture"],
      likes: 1205,
      comments: 45,
      timeAgo: "1 DAY AGO",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&q=80",
      title: "الخط العربي: فن وإبداع",
      subtitle: "جمالية الحروف العربية",
      description:
        "الخط العربي يمثل أحد أهم الفنون الإسلامية، حيث يجمع بين الجمال والمعنى في تناغم مذهل",
      tags: ["Art", "Culture"],
      likes: 1205,
      comments: 45,
      timeAgo: "1 DAY AGO",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className=" bg-card rounded-lg overflow-hidden shadow-xl mb-4 hover:shadow-2xl transition-all duration-300 hover:scale-103"
        >
          {/* Image Section */}
          <div className="relative h-100 overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Tags */}
            <div className="absolute top-4 left-4 flex gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-0 right-0 left-0 p-6 text-right">
              <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                {post.title}
              </h2>
              <p className="text-sm text-gray-200 drop-shadow-md">
                {post.subtitle}
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            <p className="text-gray-300 text-sm leading-relaxed text-right mb-6">
              {post.description}
            </p>

            {/* Engagement Section */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{post.comments}</span>
                </button>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500 uppercase">
                  {post.timeAgo}
                </span>
                <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
