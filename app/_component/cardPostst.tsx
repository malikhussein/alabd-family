"use client";
import { Heart, MessageCircle, Bookmark, Calendar, Plus } from "lucide-react";
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
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      minute: '2-digit',
      hour: '2-digit',
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
    console.log('Deleting comment:', commentId);
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
          onSubmit={handleCreatePost}
        />
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-card rounded-lg overflow-hidden shadow-xl mb-4 hover:shadow-2xl transition-all duration-300 hover:scale-103"
          >
            {/* Image Section */}
            <div className="relative h-100 overflow-hidden">
              <img
                src={post?.imageUrl}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

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

              {/* Engagement Section */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-12">
                  {/* Comment */}
                  <button
                    onClick={() => {
                      showComments(post.id);
                      setSelectedPostId(post.id);
                    }}
                    className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {/* {post.comments?.length || 0} */}
                    </span>
                  </button>

                  {/* likes */}
                  <button
                    className={`flex items-center gap-2 
                      hover:scale-120 transition-all duration-150
                      ${post.likedByMe == true ? 'text-red-500' : `text-gray-400`}`}
                    onClick={() => {
                      if (post.likedByMe == true) {
                        unLikePost(post.id);
                      } else {
                        likePost(post.id);
                      }
                    }}
                  >
                    <span className="text-sm font-medium">
                      {post.likesCount}
                    </span>
                    <Heart className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 uppercase">
                    {dateFrmat(post.createdAt)}
                  </span>
                  <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                    <Calendar className="w-5 h-5" />
                  </button>
                </div>
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
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          currentUserId="current-user-id" // Replace with actual user ID
        />
      )}
    </>
  );
}
