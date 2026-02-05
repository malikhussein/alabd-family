'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Check,
  Trash2,
  ImagePlus,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import usePostStore from '../store/post';
import useUserStore from '../store/user';
import { UserRole } from '../../entities/user.entity';

const initialBanners = [
  { id: 1, name: 'Banner 1', url: '/images/Frame.png' },
  { id: 2, name: 'Banner 2', url: '/images/Frame 12.png' },
  { id: 3, name: 'Banner 3', url: '/images/Frame 8.png' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('posts');
  const [banners, setBanners] = useState(initialBanners);

  const {
    pendingPosts,
    fetchPendingPosts,
    pendingMetadata,
    loading: postsLoading,
    error: postsError,
    approvePost,
    rejectPost,
  } = usePostStore();

  const {
    users,
    fetchUsers,
    toggleRole,
    loading: usersLoading,
    error: usersError,
    metadata: usersMetadata,
  } = useUserStore();

  useEffect(() => {
    fetchPendingPosts(1, 5);
  }, [fetchPendingPosts]);

  useEffect(() => {
    if (activeTab === 'supervisors') {
      fetchUsers(1, 10, UserRole.MODERATOR);
    }
  }, [activeTab, fetchUsers]);

  // Pagination handlers for posts
  const handleNextPage = () => {
    const totalPages = Math.ceil(pendingMetadata.total / pendingMetadata.limit);
    if (pendingMetadata.page < totalPages) {
      fetchPendingPosts(pendingMetadata.page + 1, pendingMetadata.limit);
    }
  };

  const handlePreviousPage = () => {
    if (pendingMetadata.page > 1) {
      fetchPendingPosts(pendingMetadata.page - 1, pendingMetadata.limit);
    }
  };

  // Pagination handlers for users
  const handleUsersNextPage = () => {
    const totalPages = Math.ceil(usersMetadata.total / usersMetadata.limit);
    if (usersMetadata.page < totalPages) {
      fetchUsers(usersMetadata.page + 1, usersMetadata.limit, 'SUPERVISOR');
    }
  };

  const handleUsersPreviousPage = () => {
    if (usersMetadata.page > 1) {
      fetchUsers(usersMetadata.page - 1, usersMetadata.limit, 'SUPERVISOR');
    }
  };

  // Post Management
  const handleApprove = async (postId: number) => {
    try {
      await approvePost(postId);
    } catch (error) {
      console.error('Error approving post:', error);
    }
  };

  const handleReject = async (postId: number) => {
    try {
      await rejectPost(postId);
    } catch (error) {
      console.error('Error rejecting post:', error);
    }
  };

  // User Role Management
  const handleToggleRole = async (userId: number, currentRole: string) => {
    try {
      const newRole = currentRole === 'SUPERVISOR' ? 'USER' : 'SUPERVISOR';
      await toggleRole(userId, newRole);
    } catch (error) {
      console.error('Error toggling role:', error);
    }
  };

  // Banner Management
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBanners([
          ...banners,
          {
            id: Date.now(),
            name: file.name,
            url: event.target?.result as string,
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteBanner = async (id: number) => {
    setBanners(banners.filter((banner) => banner.id !== id));
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Tabs Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-gray-800 p-2 rounded-lg">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 min-w-[150px] px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'posts'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            إدارة المنشورات
          </button>
          <button
            onClick={() => setActiveTab('supervisors')}
            className={`flex-1 min-w-[150px] px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'supervisors'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            إدارة المشرفين
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`flex-1 min-w-[150px] px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'banners'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            إدارة البنرات
          </button>
        </div>

        {/* Posts Management */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-amber-400 mb-6 text-right">
                المنشورات قيد المراجعة
              </h2>

              {postsLoading && (
                <p className="text-gray-400 text-center py-8">
                  جاري التحميل...
                </p>
              )}

              {postsError && (
                <p className="text-red-400 text-center py-8">{postsError}</p>
              )}

              <div className="space-y-4">
                {!postsLoading && !postsError && pendingPosts.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    لا توجد منشورات قيد المراجعة
                  </p>
                ) : (
                  pendingPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-gray-700 rounded-lg p-6 hover:bg-gray-650 transition-all"
                    >
                      <div className="flex flex-col gap-4">
                        {/* Author Info */}
                        <div className="flex items-center justify-end gap-3 pb-4 border-b border-gray-600">
                          <div className="text-right">
                            <h3 className="text-lg font-bold text-amber-400">
                              {post.author?.name || 'مستخدم'}
                            </h3>
                            <p className="text-xs text-gray-400">
                              {new Date(post.createdAt).toLocaleDateString(
                                'ar-SA',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                },
                              )}
                            </p>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                            {post.author?.profileImageUrl ? (
                              <Image
                                src={post.author.profileImageUrl}
                                alt={post.author.name || 'User'}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <span>{post.author?.name?.charAt(0)}</span>
                            )}
                          </div>
                        </div>

                        {/* Post Content */}
                        <div className="text-right">
                          <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">
                            {post.text}
                          </p>
                        </div>

                        {/* Post Image if exists */}
                        {post.imageUrl && (
                          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
                            <Image
                              src={post.imageUrl}
                              alt="صورة المنشور"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4 border-t border-gray-600">
                          <button
                            onClick={() => handleApprove(post.id)}
                            disabled={postsLoading}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Check size={20} />
                            قبول المنشور
                          </button>
                          <button
                            onClick={() => handleReject(post.id)}
                            disabled={postsLoading}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X size={20} />
                            رفض المنشور
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination controls */}
              {!postsLoading && !postsError && pendingPosts.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={handleNextPage}
                    disabled={
                      pendingMetadata.page >=
                      Math.ceil(pendingMetadata.total / pendingMetadata.limit)
                    }
                    className="bg-primary hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                    التالي
                  </button>

                  <div className="text-center text-gray-400">
                    <p>
                      الصفحة {pendingMetadata.page} من{' '}
                      {Math.ceil(pendingMetadata.total / pendingMetadata.limit)}
                    </p>
                    <p className="text-sm">
                      عرض {pendingPosts.length} من أصل {pendingMetadata.total}{' '}
                      منشور
                    </p>
                  </div>

                  <button
                    onClick={handlePreviousPage}
                    disabled={pendingMetadata.page <= 1}
                    className="bg-primary hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    السابق
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Supervisors Management */}
        {activeTab === 'supervisors' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-amber-400 mb-6 text-right">
                قائمة المشرفين
              </h2>

              {usersLoading && (
                <p className="text-gray-400 text-center py-8">
                  جاري التحميل...
                </p>
              )}

              {usersError && (
                <p className="text-red-400 text-center py-8">{usersError}</p>
              )}

              <div className="space-y-4">
                {!usersLoading && !usersError && users.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    لا يوجد مشرفين حالياً
                  </p>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="bg-gray-700 rounded-lg p-6 hover:bg-gray-650 transition-all"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleToggleRole(user.id, user.role)}
                            disabled={usersLoading}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-amber-600 hover:bg-amber-700 text-white`}
                          >
                            <>
                              <Shield size={20} />
                              إلغاء الإشراف
                            </>
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <h3 className="text-xl font-bold text-amber-400">
                              {user.name}
                            </h3>
                            <p className="text-gray-200 text-sm">
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {user.role === 'SUPERVISOR' ? 'مشرف' : 'مستخدم'}
                            </p>
                          </div>
                          <div className="w-16 h-16 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                            {user.profileImageUrl ? (
                              <Image
                                src={user.profileImageUrl}
                                alt={user.name}
                                width={64}
                                height={64}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <span>{user.name.charAt(0)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination controls for users */}
              {!usersLoading && !usersError && users.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={handleUsersNextPage}
                    disabled={
                      usersMetadata.page >=
                      Math.ceil(usersMetadata.total / usersMetadata.limit)
                    }
                    className="bg-primary hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                    التالي
                  </button>

                  <div className="text-center text-gray-400">
                    <p>
                      الصفحة {usersMetadata.page} من{' '}
                      {Math.ceil(usersMetadata.total / usersMetadata.limit)}
                    </p>
                    <p className="text-sm">
                      عرض {users.length} من أصل {usersMetadata.total} مستخدم
                    </p>
                  </div>

                  <button
                    onClick={handleUsersPreviousPage}
                    disabled={usersMetadata.page <= 1}
                    className="bg-primary hover:bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    السابق
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Banners Management */}
        {activeTab === 'banners' && (
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <label className="bg-primary hover:bg-amber-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-bold cursor-pointer transition-all">
                <ImagePlus size={20} />
                إضافة بنر جديد
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </label>
              <h2 className="text-2xl font-bold text-amber-400 text-right">
                إدارة البنرات
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <div
                  key={banner.id}
                  className="relative group overflow-hidden rounded-lg shadow-xl"
                >
                  <div className="relative h-64">
                    <Image
                      src={banner.url}
                      alt={banner.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => deleteBanner(banner.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transition-all transform scale-0 group-hover:scale-100"
                      >
                        <Trash2 size={24} />
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-700 p-4 text-center">
                    <p className="text-amber-400 font-bold">{banner.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
