"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import useUserStore from "../store/user";
 
export default function Profile() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { updateProfilePicture, getMe, myData } = useUserStore();

  useEffect(() => {
    getMe();
  }, [getMe]);

  // ✅ Fixed
  const handleFileChange = (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target?.result as string);
    };
    reader.readAsDataURL(file); // ← this line was missing
    updateProfilePicture(file);
    
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const triggerFileInput = () => fileInputRef.current?.click();

 

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {myData?.name}
            </h1>
            <p className="text-white/40 text-sm mt-1">{myData?.email}</p>
          </div>

          {/* Avatar Upload Area */}
          <div className="flex flex-col items-center gap-5">
            <div
              className={`
                relative group cursor-pointer rounded-full transition-all duration-300
                ${isDragging ? "scale-105" : "scale-100"}
              `}
              onClick={triggerFileInput}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              {/* Glow ring */}
              <div
                className={`
                  absolute -inset-1 rounded-full transition-opacity duration-300
                  bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500
                  ${isHovering || isDragging ? "opacity-80" : "opacity-30"}
                `}
              />

              {/* Avatar circle */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden bg-[#2a2a2a] border-2 border-white/10">
                {(myData?.profileImageUrl || profileImage) && (
                  <Image
                    src={myData?.profileImageUrl || profileImage || ""}
                    alt="Profile"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}

                {/* Hover overlay */}
                <div
                  className={`
                    absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1
                    transition-opacity duration-300
                    ${isHovering || isDragging ? "opacity-100" : "opacity-0"}
                  `}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-7 h-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5V19a1.5 1.5 0 001.5 1.5h15A1.5 1.5 0 0021 19v-2.5M16 8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <span className="text-white text-xs font-medium">
                    {profileImage ? "Change" : "Upload"}
                  </span>
                </div>

              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={triggerFileInput}
                className="
                  flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold
                  bg-primary from-amber-500 to-orange-500
                  text-white shadow-lg shadow-orange-900/30
                  hover:from-amber-400 hover:to-orange-400
                  active:scale-95 transition-all duration-200
                "
              >
                تحديث الصورة الشخصية
               </button>

            
            </div>

            {/* Hint */}
            <p className="text-white/25 text-xs text-center">
              JPG, PNG, GIF or WEBP · Drag & drop supported
            </p>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
