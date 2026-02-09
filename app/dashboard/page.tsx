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
  Users,
  Search,
  Edit,
} from 'lucide-react';
import usePostStore from '../store/post';
import useUserStore from '../store/user';
import useBannerStore from '../store/banner';
import { UserRole } from '../../entities/user.entity';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('posts');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [bannerText, setBannerText] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [editingBanner, setEditingBanner] = useState<number | null>(null);
  const [editBannerText, setEditBannerText] = useState('');
  const [editBannerFile, setEditBannerFile] = useState<File | null>(null);

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

  const {
    banners,
    loading: bannersLoading,
    error: bannersError,
    fetchBanners,
    createBanner,
    updateBanner,
    deleteBanner,
  } = useBannerStore();

  useEffect(() => {
    fetchPendingPosts(1, 5);
  }, [fetchPendingPosts]);

  useEffect(() => {
    if (activeTab === 'supervisors') {
      fetchUsers(1, 10, UserRole.MODERATOR);
    }
  }, [activeTab, fetchUsers]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers(1, 10, UserRole.USER, searchKeyword);
    }
  }, [activeTab, searchKeyword, fetchUsers]);

  useEffect(() => {
    if (activeTab === 'banners') {
      fetchBanners();
    }
  }, [activeTab, fetchBanners]);

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

  // Pagination handlers for supervisors
  const handleSupervisorsNextPage = () => {
    const totalPages = Math.ceil(usersMetadata.total / usersMetadata.limit);
    if (usersMetadata.page < totalPages) {
      fetchUsers(
        usersMetadata.page + 1,
        usersMetadata.limit,
        UserRole.MODERATOR,
      );
    }
  };

  const handleSupervisorsPreviousPage = () => {
    if (usersMetadata.page > 1) {
      fetchUsers(
        usersMetadata.page - 1,
        usersMetadata.limit,
        UserRole.MODERATOR,
      );
    }
  };

  // Pagination handlers for all users
  const handleUsersNextPage = () => {
    const totalPages = Math.ceil(usersMetadata.total / usersMetadata.limit);
    if (usersMetadata.page < totalPages) {
      fetchUsers(
        usersMetadata.page + 1,
        usersMetadata.limit,
        UserRole.USER,
        searchKeyword,
      );
    }
  };

  const handleUsersPreviousPage = () => {
    if (usersMetadata.page > 1) {
      fetchUsers(
        usersMetadata.page - 1,
        usersMetadata.limit,
        UserRole.USER,
        searchKeyword,
      );
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
  const handleRemoveModerator = async (userId: number) => {
    try {
      await toggleRole(userId, UserRole.USER);
      await fetchUsers(
        usersMetadata.page,
        usersMetadata.limit,
        UserRole.MODERATOR,
      );
    } catch (error) {
      console.error('Error removing moderator:', error);
    }
  };

  const handlePromoteToModerator = async (userId: number) => {
    try {
      await toggleRole(userId, UserRole.MODERATOR);
      await fetchUsers(
        usersMetadata.page,
        usersMetadata.limit,
        undefined,
        searchKeyword,
      );
    } catch (error) {
      console.error('Error promoting to moderator:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchKeyword(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchKeyword('');
  };

  // Banner Management
  const handleBannerFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
    }
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerFile || !bannerText.trim()) {
      alert('يرجى إدخال النص واختيار صورة للبنر');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', bannerFile);
      formData.append('text', bannerText.trim());

      await createBanner(formData);
      // Reset form
      setBannerText('');
      setBannerFile(null);
      setShowBannerForm(false);
    } catch (error) {
      console.error('Error uploading banner:', error);
    }
  };

  const handleEditBannerFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditBannerFile(file);
    }
  };

  const handleStartEdit = (banner: { id: number; text: string }) => {
    setEditingBanner(banner.id);
    setEditBannerText(banner.text);
    setEditBannerFile(null);
  };

  const handleUpdateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    if (!editBannerText.trim()) {
      alert('يرجى إدخال النص للبنر');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('text', editBannerText.trim());
      if (editBannerFile) {
        formData.append('file', editBannerFile);
      }

      await updateBanner(editingBanner, formData);
      // Reset edit state
      setEditingBanner(null);
      setEditBannerText('');
      setEditBannerFile(null);
    } catch (error) {
      console.error('Error updating banner:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingBanner(null);
    setEditBannerText('');
    setEditBannerFile(null);
  };

  const handleDeleteBanner = async (id: number) => {
    try {
      await deleteBanner(id);
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
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
            onClick={() => setActiveTab('users')}
            className={`flex-1 min-w-[150px] px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'users'
                ? 'bg-primary text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            إدارة المستخدمين
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
                        <button
                          onClick={() => handleRemoveModerator(user.id)}
                          disabled={usersLoading}
                          className="px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 text-white"
                        >
                          <X size={20} />
                          إزالة الإشراف
                        </button>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <h3 className="text-xl font-bold text-amber-400">
                              {user.name}
                            </h3>
                            <p className="text-gray-200 text-sm">
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-400 mt-1 flex items-center justify-end gap-1">
                              <Shield size={14} />
                              مشرف
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

              {/* Pagination controls for supervisors */}
              {!usersLoading && !usersError && users.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <button
                    onClick={handleSupervisorsNextPage}
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
                      عرض {users.length} من أصل {usersMetadata.total} مشرف
                    </p>
                  </div>

                  <button
                    onClick={handleSupervisorsPreviousPage}
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

        {/* All Users Management */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-amber-400 mb-6 text-right">
                إدارة المستخدمين
              </h2>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={usersLoading}
                    className="bg-primary hover:bg-amber-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Search size={20} />
                    بحث
                  </button>
                  {searchKeyword && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-3 rounded-lg font-bold transition-all"
                    >
                      مسح البحث
                    </button>
                  )}
                  <input
                    type="text"
                    placeholder="ابحث عن مستخدم بالاسم..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </form>

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
                    {searchKeyword
                      ? 'لم يتم العثور على مستخدمين'
                      : 'لا يوجد مستخدمين'}
                  </p>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="bg-gray-700 rounded-lg p-6 hover:bg-gray-650 transition-all"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePromoteToModerator(user.id)}
                            disabled={usersLoading}
                            className="px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Shield size={20} />
                            ترقية لمشرف
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
                            <p className="text-xs text-gray-400 mt-1 flex items-center justify-end gap-1">
                              {user.role === UserRole.MODERATOR ? (
                                <>
                                  <Shield size={14} />
                                  مشرف
                                </>
                              ) : user.role === UserRole.ADMIN ? (
                                <>
                                  <Shield size={14} />
                                  مدير
                                </>
                              ) : (
                                <>
                                  <Users size={14} />
                                  مستخدم
                                </>
                              )}
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

              {/* Pagination controls for all users */}
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
              <button
                onClick={() => setShowBannerForm(!showBannerForm)}
                disabled={bannersLoading}
                className="bg-primary hover:bg-amber-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ImagePlus size={20} />
                {showBannerForm ? 'إلغاء' : 'إضافة بنر جديد'}
              </button>
              <h2 className="text-2xl font-bold text-amber-400 text-right">
                إدارة البنرات
              </h2>
            </div>

            {/* Add Banner Form */}
            {showBannerForm && (
              <form
                onSubmit={handleCreateBanner}
                className="bg-gray-700 rounded-lg p-6 mb-6"
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-amber-400 font-bold mb-2 text-right">
                      نص البنر *
                    </label>
                    <input
                      type="text"
                      value={bannerText}
                      onChange={(e) => setBannerText(e.target.value)}
                      placeholder="أدخل نص البنر..."
                      className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-amber-400 font-bold mb-2 text-right">
                      صورة البنر *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerFileSelect}
                      className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-amber-600"
                      required
                    />
                    {bannerFile && (
                      <p className="text-gray-300 text-sm mt-2 text-right">
                        الملف المحدد: {bannerFile.name}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowBannerForm(false);
                        setBannerText('');
                        setBannerFile(null);
                      }}
                      className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-bold transition-all"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={bannersLoading}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      إضافة البنر
                    </button>
                  </div>
                </div>
              </form>
            )}

            {bannersLoading && (
              <p className="text-gray-400 text-center py-8">جاري التحميل...</p>
            )}

            {bannersError && (
              <p className="text-red-400 text-center py-8">{bannersError}</p>
            )}

            {!bannersLoading && !bannersError && banners.length === 0 && (
              <p className="text-gray-400 text-center py-8">
                لا توجد بنرات. قم بإضافة بنر جديد.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <div key={banner.id}>
                  {editingBanner === banner.id ? (
                    <form
                      onSubmit={handleUpdateBanner}
                      className="bg-gray-700 rounded-lg p-4"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-amber-400 font-bold mb-2 text-right">
                            نص البنر *
                          </label>
                          <input
                            type="text"
                            value={editBannerText}
                            onChange={(e) => setEditBannerText(e.target.value)}
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-amber-400 font-bold mb-2 text-right">
                            صورة جديدة (اختياري)
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleEditBannerFileSelect}
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg text-sm file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-amber-600"
                          />
                          {editBannerFile && (
                            <p className="text-gray-300 text-xs mt-1 text-right">
                              {editBannerFile.name}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all"
                          >
                            إلغاء
                          </button>
                          <button
                            type="submit"
                            disabled={bannersLoading}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            حفظ
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="relative group overflow-hidden rounded-lg shadow-xl">
                      <div className="relative h-64">
                        <Image
                          src={banner.imageUrl}
                          alt={banner.text}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button
                            onClick={() => handleStartEdit(banner)}
                            disabled={bannersLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full transition-all transform scale-0 group-hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Edit size={24} />
                          </button>
                          <button
                            onClick={() => handleDeleteBanner(banner.id)}
                            disabled={bannersLoading}
                            className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transition-all transform scale-0 group-hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={24} />
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-700 p-4 text-center">
                        <p className="text-amber-400 font-bold">
                          {banner.text}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
