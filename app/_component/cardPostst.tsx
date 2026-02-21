"use client";
import Image from "next/image";
import { CircleOff, MessageCircle, Plus, ThumbsUp } from "lucide-react";
import usePostStore from "../store/post";
import { useEffect, useState } from "react";
import CommentsModal from "./CommentModal";
import AddPostModal from "./addPostModa";

export default function CardPosts() {
  const {
    fetchPosts,
    likePost,
    posts,
    Comment,
    loading,
    createComment,
    showComments,
    unLikePost,
  } = usePostStore();
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isAddPostOpen, setIsAddPostOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const dateFrmat = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      minute: "2-digit",
      hour: "2-digit",
    });
  };

  const handleAddComment = (postId: number, text: string) => {
    createComment({ postId, content: text });
  };

  const handleCreatePost = (text: string, imageUrl: string) => {
    console.log("Creating post with text:", text, "and image URL:", imageUrl);
    setIsAddPostOpen(false); // Close the modal after creating the post
  };

  const handleDeleteComment = (commentId: string) => {
    console.log("Deleting comment:", commentId);
    // Add your delete comment logic here
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* if the user eas mentor or admin show the add post button */}
        <div className="my-7">
          <button
            onClick={() => setIsAddPostOpen(true)}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-lg p-4 flex items-center gap-3 transition-all shadow-lg hover:shadow-xl"
          >
            <div className="w-10 h-10 rounded-full   bg-accent-foreground flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-gray-400 text-right flex-1 text-xl">
              اضغط هنا لاضافة منشور جديد
            </span>
          </button>
        </div>

        <AddPostModal
          isOpen={isAddPostOpen}
          onClose={() => setIsAddPostOpen(false)}
        />
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-card rounded-lg overflow-hidden shadow-xl mb-4 hover:shadow-2xl transition-all duration-300 hover:scale-103"
          >
            {/* Image Section */}
            <div className="relative h-100 overflow-hidden">
              {post.imageUrl ? (
                <Image
                  src={post.imageUrl}
                  alt={post.text || "Post Image"}
                  fill
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 grid content-center justify-items-center ">
                  <CircleOff className="text-white" />
                  <span className="text-white">لا توجد صورة</span>
                </div>
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

              {/* Title Overlay */}
              <div className="absolute bottom-0 right-0 left-0 p-6 text-right">
                <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                  {/* {post.title} */}
                </h2>
                <p className="text-sm text-gray-200 drop-shadow-md">
                  {/* {post.subtitle} */}
                </p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <p className="text-gray-300 text-sm leading-relaxed text-right mb-6">
                {post.text}
              </p>

              <div className="flex items-center justify-start gap-6">
                {/* Like Count Display */}
                {post.likesCount > 0 && (
                  <div className="flex items-center gap-2 pb-3 text-lg text-gray-400">
                    <ThumbsUp className="w-5 h-5 fill-blue-500 text-blue-500 " />
                    <span>{post.likesCount}</span>
                  </div>
                )}

                {post.commentsCount > 0 && (
                  <div
                    className="flex items-center gap-2 pb-3 text-lg text-gray-400"
                  >
                    <MessageCircle className="w-5 h-5 fill-blue-500 text-blue-500" />
                    <span>{post.commentsCount}</span>
                  </div>
                )}
              </div>

              {/* Engagement Section - Facebook Style */}
              <div className="flex items-center justify-between gap-2 py-2 border-t border-b border-gray-700">
                {/* Comment Button */}
                <button
                  onClick={() => {
                    showComments(post.id);
                    setSelectedPostId(post.id);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-gray-400 hover:bg-gray-800 transition-all duration-150"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-semibold">تعليق</span>
                </button>
                {/* Like Button */}
                <button
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all duration-150 hover:bg-gray-800
                    ${post.likedByMe ? "text-blue-500" : "text-gray-400"}`}
                  onClick={() => {
                    if (post.likedByMe == true) {
                      unLikePost(post.id);
                    } else {
                      likePost(post.id);
                    }
                  }}
                >
                  <ThumbsUp
                    className={`w-5 h-5 ${post.likedByMe ? "fill-blue-500" : ""}`}
                  />
                  <span className="text-sm font-semibold">أعجبنى</span>
                </button>
              </div>

              {/* Date */}
              <div className="flex items-center justify-end mt-3">
                <span className="text-xs text-gray-500">
                  {dateFrmat(post.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comments Modal */}
      {selectedPostId && (
        <CommentsModal
          isOpen={!!selectedPostId}
          onClose={() => setSelectedPostId(null)}
          postId={selectedPostId}
          comments={Comment}
          loading={loading}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          currentUserId="current-user-id" // Replace with actual user ID
        />
      )}
    </>
  );
}
