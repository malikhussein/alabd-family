"use client";
import { Send, MoreVertical, Trash2, MessageCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Comment {
  id: string;
  content: string;
  user: {
    id: number;
    name: string;
  };
  createdAt: Date;
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number | null;
  comments: Comment[];
  onAddComment: (postId: number, text: string) => void;
  onLikeComment?: (commentId: string) => void;
  onDeleteComment?: (commentId: string) => void;
  currentUserId?: string;
}

export default function CommentsModal({
  isOpen,
  onClose,
  postId,
  comments,
  onAddComment,
  onDeleteComment,
  currentUserId,
}: CommentsModalProps) {
  const [commentText, setCommentText] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && postId !== null) {
      // ← Added null check
      onAddComment(postId, commentText.trim());
      setCommentText("");
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date(); // This uses YOUR local timezone
    const createdDate = new Date(date); // Converts UTC string to local time

    const diffInSeconds = Math.floor(
      (now.getTime() - createdDate.getTime()) / 1000000, // ✅ Correct!
    );

    console.log("sda", diffInSeconds);
    if (diffInSeconds < 60) {
      return "الآن";
    } else if (diffInSeconds < 3600) {
      return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    } else if (diffInSeconds < 86400) {
      return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    } else if (diffInSeconds < 604800) {
      return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
    } else {
      return date.toLocaleDateString("ar-EG", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0 gap-0 bg-gray-900 border-gray-800">
        <DialogHeader className="p-4 pb-3 border-b border-gray-800">
          <DialogTitle className="text-lg font-semibold text-white text-right">
            التعليقات ({comments?.length})
          </DialogTitle>
        </DialogHeader>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(85vh-140px)]">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-gray-500 text-sm">لا توجد تعليقات بعد</p>
              <p className="text-gray-600 text-xs mt-1">كن أول من يعلق!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div
                key={comment?.id}
                className="flex gap-3 group hover:bg-gray-800/30 p-3 rounded-lg transition-all"
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {comment.user?.name?.charAt(0).toUpperCase() || "؟"}{" "}
                    {/* ← Added safe navigation */}
                  </div>
                </div>

                {/* Comment Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-white">
                          {comment.user?.name || "مستخدم"}{" "}
                          {/* ← Added fallback */}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed break-words text-right">
                        {comment.content}
                      </p>
                    </div>

                    {/* More Options */}
                    {currentUserId === comment.user?.id.toString() &&
                      onDeleteComment && (
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveMenu(
                                activeMenu === comment.id ? null : comment.id,
                              )
                            }
                            className="p-1 hover:bg-gray-700 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>

                          {activeMenu === comment.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setActiveMenu(null)}
                              />
                              <div className="absolute left-0 mt-1 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-1 z-50 min-w-[120px]">
                                <button
                                  onClick={() => {
                                    onDeleteComment(comment.id);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-xs text-right hover:bg-gray-700 transition-colors flex items-center gap-2 text-red-400"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  حذف
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={commentsEndRef} />
        </div>

        {/* Input Section */}
        <div className="border-t border-gray-800 p-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                أ
              </div>
            </div>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="اكتب تعليقاً..."
                className="w-full bg-gray-800 text-white rounded-full px-4 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
                dir="rtl"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
