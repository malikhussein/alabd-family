'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Check,
  Trash2,
  UserPlus,
  ImagePlus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import usePostStore from '../store/post';

const initialSupervisors = [
  {
    id: 1,
    name: 'عبدالله بن محمد',
    role: 'مشرف رئيسي',
    email: 'abdullah@example.com',
  },
  {
    id: 2,
    name: 'فيصل بن سعود',
    role: 'مشرف المحتوى',
    email: 'faisal@example.com',
  },
];

const initialBanners = [
  { id: 1, name: 'Banner 1', url: '/images/Frame.png' },
  { id: 2, name: 'Banner 2', url: '/images/Frame 12.png' },
  { id: 3, name: 'Banner 3', url: '/images/Frame 8.png' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('posts');
  const [supervisors, setSupervisors] = useState(initialSupervisors);
  const [banners, setBanners] = useState(initialBanners);
  const [newSupervisor, setNewSupervisor] = useState({
    name: '',
    role: '',
    email: '',
  });
  const [showAddSupervisor, setShowAddSupervisor] = useState(false);

  const {
    pendingPosts,
    fetchPendingPosts,
    pendingMetadata,
    loading,
    error,
    approvePost,
    rejectPost,
  } = usePostStore();

  useEffect(() => {
    fetchPendingPosts(1, 5);
  }, [fetchPendingPosts]);

  // Pagination handlers
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

  // Supervisor Management
  const addSupervisor = async () => {
    if (newSupervisor.name && newSupervisor.role && newSupervisor.email) {
      // TODO: Add API call to create supervisor
      // await fetch('/api/supervisors', { method: 'POST', body: JSON.stringify(newSupervisor) });

      setSupervisors([...supervisors, { ...newSupervisor, id: Date.now() }]);
      setNewSupervisor({ name: '', role: '', email: '' });
      setShowAddSupervisor(false);
    }
  };

  const removeSupervisor = async (id: number) => {
    // TODO: Add API call to delete supervisor
    // await fetch(`/api/supervisors/${id}`, { method: 'DELETE' });

    setSupervisors(supervisors.filter((sup) => sup.id !== id));
  };

  // Banner Management
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Upload to your storage (e.g., AWS S3, Cloudinary, etc.)
      // const formData = new FormData();
      // formData.append('file', file);
      // await fetch('/api/upload', { method: 'POST', body: formData });

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
    // TODO: Add API call to delete banner
    // await fetch(`/api/banners/${id}`, { method: 'DELETE' });

    setBanners(banners.filter((banner) => banner.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
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

              {loading && (
                <p className="text-gray-400 text-center py-8">
                  جاري التحميل...
                </p>
              )}

              {error && (
                <p className="text-red-400 text-center py-8">{error}</p>
              )}

              <div className="space-y-4">
                {!loading && !error && pendingPosts.length === 0 ? (
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
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                            {post.author?.profileImageUrl ? (
                              <Image
                                src={post.author.profileImageUrl}
                                alt={post.author.name || 'User'}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <span>{post.author?.name?.charAt(0) || 'م'}</span>
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
                            disabled={loading}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Check size={20} />
                            قبول المنشور
                          </button>
                          <button
                            onClick={() => handleReject(post.id)}
                            disabled={loading}
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
              {!loading && !error && pendingPosts.length > 0 && (
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
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => setShowAddSupervisor(!showAddSupervisor)}
                  className="bg-primary hover:bg-amber-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-bold transition-all"
                >
                  <UserPlus size={20} />
                  إضافة مشرف جديد
                </button>
                <h2 className="text-2xl font-bold text-amber-400 text-right">
                  قائمة المشرفين
                </h2>
              </div>

              {showAddSupervisor && (
                <div className="bg-gray-700 rounded-lg p-6 mb-6">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="الاسم"
                      value={newSupervisor.name}
                      onChange={(e) =>
                        setNewSupervisor({
                          ...newSupervisor,
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg text-right"
                    />
                    <input
                      type="text"
                      placeholder="الدور الوظيفي"
                      value={newSupervisor.role}
                      onChange={(e) =>
                        setNewSupervisor({
                          ...newSupervisor,
                          role: e.target.value,
                        })
                      }
                      className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg text-right"
                    />
                    <input
                      type="email"
                      placeholder="البريد الإلكتروني"
                      value={newSupervisor.email}
                      onChange={(e) =>
                        setNewSupervisor({
                          ...newSupervisor,
                          email: e.target.value,
                        })
                      }
                      className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg text-right"
                    />
                    <button
                      onClick={addSupervisor}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-all"
                    >
                      حفظ المشرف
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {supervisors.map((supervisor) => (
                  <div
                    key={supervisor.id}
                    className="bg-gray-700 rounded-lg p-6 flex justify-between items-center hover:bg-gray-650 transition-all"
                  >
                    <button
                      onClick={() => removeSupervisor(supervisor.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="text-right flex-1 mr-4">
                      <h3 className="text-xl font-bold text-amber-400">
                        {supervisor.name}
                      </h3>
                      <p className="text-gray-200">{supervisor.role}</p>
                      <p className="text-sm text-gray-400">
                        {supervisor.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
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
