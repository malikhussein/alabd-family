"use client";
import React, { useState, useRef } from "react";
import { X, Image, Smile, MapPin, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AddPostModal({ isOpen, onClose, onSubmit }) {
  const [postText, setPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!postText.trim() && !selectedImage) return;

    onSubmit({
      text: postText,
      image: selectedImage,
    });

    // Reset form
    setPostText("");
    setSelectedImage(null);
    setImagePreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] bg-gray-900 border-gray-800 text-white p-0 gap-0">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-gray-800">
          <DialogTitle className="text-xl font-bold text-center">
            إنشاء منشور
          </DialogTitle>
        </DialogHeader>

        {/* User Info */}
        <div className="flex flex-row-reverse  justify-items-start gap-3 px-4 pt-4">
          <div className="w-10 h-10 rounded-full bg-accent-foreground from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            أ
          </div>
          <div className="text-right">
            <p className="text-white font-semibold">أنت</p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span>عام</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="px-4  mt-4 py-8 max-h-[50vh] overflow-y-auto">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="ماذا تريد أن تقول؟"
            className="w-full bg-transparent text-white text-lg placeholder-gray-500 resize-none outline-none min-h-[180px] text-right"
            dir="rtl"
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative mt-4 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto max-h-[400px] object-cover rounded-lg"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-gray-900/80 hover:bg-gray-900 rounded-full p-2 transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Add to Post Section */}
        <div className="px-4 py-3 border-t border-gray-800">
          <div className="flex items-center justify-between p-3 border border-gray-800 rounded-lg">
            <div className="flex items-center gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-gray-800 rounded-full transition-all group"
                title="صورة/فيديو"
              >
                <Image className="w-6 h-6 text-green-500 group-hover:scale-110 transition-transform" />
              </button>
              <button
                className="p-2 hover:bg-gray-800 rounded-full transition-all group"
                title="شعور/نشاط"
              >
                <Smile className="w-6 h-6 text-yellow-500 group-hover:scale-110 transition-transform" />
              </button>
            </div>
            <span className="text-white font-medium text-sm">
              أضف إلى منشورك
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="px-4 pb-4">
          <button
            onClick={handleSubmit}
            disabled={!postText.trim() && !selectedImage}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              postText.trim() || selectedImage
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            نشر
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
