"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, X, Check, Trash2, UserPlus, ImagePlus } from 'lucide-react';

// Mock data - Replace with actual database queries
const initialPosts = [
  { id: 1, author: 'محمد بن سعود', content: 'مبادرة جديدة لدعم الشباب في القبيلة...', date: '2026-01-10', status: 'pending' },
  { id: 2, author: 'أحمد بن فيصل', content: 'تهنئة بمناسبة الزواج الميمون...', date: '2026-01-09', status: 'pending' },
  { id: 3, author: 'خالد بن راشد', content: 'دعوة لحضور الاجتماع السنوي...', date: '2026-01-08', status: 'approved' },
];

const initialSupervisors = [
  { id: 1, name: 'عبدالله بن محمد', role: 'مشرف رئيسي', email: 'abdullah@example.com' },
  { id: 2, name: 'فيصل بن سعود', role: 'مشرف المحتوى', email: 'faisal@example.com' },
];

const initialBanners = [
  { id: 1, name: 'Banner 1', url: '/images/Frame.png' },
  { id: 2, name: 'Banner 2', url: '/images/Frame 12.png' },
  { id: 3, name: 'Banner 3', url: '/images/Frame 8.png' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState(initialPosts);
  const [supervisors, setSupervisors] = useState(initialSupervisors);
  const [banners, setBanners] = useState(initialBanners);
  const [newSupervisor, setNewSupervisor] = useState({ name: '', role: '', email: '' });
  const [showAddSupervisor, setShowAddSupervisor] = useState(false);

  // Post Management
  const handlePostAction = async (postId: number, action: string) => {
    // TODO: Add API call to update post status
    // await fetch(`/api/posts/${postId}`, { method: 'PATCH', body: JSON.stringify({ status: action }) });
    
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, status: action } : post
    ));
  };

  const deletePost = async (postId: number) => {
    // TODO: Add API call to delete post
    // await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    
    setPosts(posts.filter(post => post.id !== postId));
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
    
    setSupervisors(supervisors.filter(sup => sup.id !== id));
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
        setBanners([...banners, { id: Date.now(), name: file.name, url: event.target?.result as string }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteBanner = async (id: number) => {
    // TODO: Add API call to delete banner
    // await fetch(`/api/banners/${id}`, { method: 'DELETE' });
    
    setBanners(banners.filter(banner => banner.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      {/* <div className="text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">لوحة التحكم الإدارية</h1>
          <p className="text-center mt-2 text-amber-100">إدارة المحتوى والمشرفين</p>
        </div>
      </div> */}

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
              <h2 className="text-2xl font-bold text-amber-400 mb-6 text-right">المنشورات قيد المراجعة</h2>
              <div className="space-y-4">
                {posts.filter(p => p.status === 'pending').length === 0 ? (
                  <p className="text-gray-400 text-center py-8">لا توجد منشورات قيد المراجعة</p>
                ) : (
                  posts.filter(p => p.status === 'pending').map(post => (
                    <div key={post.id} className="bg-gray-700 rounded-lg p-6 hover:bg-gray-650 transition-all">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1 text-right">
                          <h3 className="text-xl font-bold text-amber-400 mb-2">{post.author}</h3>
                          <p className="text-gray-200 mb-2">{post.content}</p>
                          <p className="text-sm text-gray-400">{post.date}</p>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <button
                            onClick={() => handlePostAction(post.id, 'approved')}
                            className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
                          >
                            <Check size={20} />
                            قبول
                          </button>
                          <button
                            onClick={() => handlePostAction(post.id, 'rejected')}
                            className="flex-1 md:flex-none bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
                          >
                            <X size={20} />
                            رفض
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-amber-400 mb-6 text-right">المنشورات المعتمدة</h2>
              <div className="space-y-4">
                {posts.filter(p => p.status === 'approved').map(post => (
                  <div key={post.id} className="bg-gray-700 rounded-lg p-6 flex justify-between items-center">
                    <button
                      onClick={() => deletePost(post.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="text-right flex-1 mr-4">
                      <h3 className="text-lg font-bold text-amber-400">{post.author}</h3>
                      <p className="text-gray-200">{post.content}</p>
                    </div>
                  </div>
                ))}
              </div>
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
                <h2 className="text-2xl font-bold text-amber-400 text-right">قائمة المشرفين</h2>
              </div>

              {showAddSupervisor && (
                <div className="bg-gray-700 rounded-lg p-6 mb-6">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="الاسم"
                      value={newSupervisor.name}
                      onChange={(e) => setNewSupervisor({...newSupervisor, name: e.target.value})}
                      className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg text-right"
                    />
                    <input
                      type="text"
                      placeholder="الدور الوظيفي"
                      value={newSupervisor.role}
                      onChange={(e) => setNewSupervisor({...newSupervisor, role: e.target.value})}
                      className="w-full bg-gray-600 text-white px-4 py-3 rounded-lg text-right"
                    />
                    <input
                      type="email"
                      placeholder="البريد الإلكتروني"
                      value={newSupervisor.email}
                      onChange={(e) => setNewSupervisor({...newSupervisor, email: e.target.value})}
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
                {supervisors.map(supervisor => (
                  <div key={supervisor.id} className="bg-gray-700 rounded-lg p-6 flex justify-between items-center hover:bg-gray-650 transition-all">
                    <button
                      onClick={() => removeSupervisor(supervisor.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="text-right flex-1 mr-4">
                      <h3 className="text-xl font-bold text-amber-400">{supervisor.name}</h3>
                      <p className="text-gray-200">{supervisor.role}</p>
                      <p className="text-sm text-gray-400">{supervisor.email}</p>
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
              <h2 className="text-2xl font-bold text-amber-400 text-right">إدارة البنرات</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map(banner => (
                <div key={banner.id} className="relative group overflow-hidden rounded-lg shadow-xl">
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