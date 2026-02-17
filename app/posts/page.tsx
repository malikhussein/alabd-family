 import React from "react";
import hzImage from "../../public/images/hz.png";
import CardPosts from "../_component/cardPostst";
import SideBar from "../_component/sideBar";
import Image from "next/image";
import usePostStore from "../store/post";
import useUserStore from "../store/user";
 
 export default function Posts() {



  return (
    <>
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
                مجتمــع
              </h3>
              <h3 className="text-xl md:text-2xl lg:text-4xl font-bold text-white mt-4">
                القبيلــــــة
              </h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mt-12">
          {/* Posts Section - Takes 2 columns on large screens */}

          {/* Sidebar - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <SideBar />
          </div>

          <div className="lg:col-span-2">
            <CardPosts />
          </div>
        </div>
      </div>
    </>
  );
}
