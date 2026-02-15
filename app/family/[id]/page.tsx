'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useFamilyDataStore from '../../store/family-data';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import bannerImage from '../../../public/images/Frame 8.png';
import { UserRole } from '../../../entities/user.entity';

export default function FamilyInfo() {
  const { data: session } = useSession();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState('');

  const { familyData, loading, error, fetchOneFamilyData, updateFamilyData } =
    useFamilyDataStore();

  useEffect(() => {
    if (id) {
      fetchOneFamilyData(Number(id));
    }
  }, [id, fetchOneFamilyData]);

  useEffect(() => {
    if (familyData?.familyInfo) {
      setEditedInfo(familyData.familyInfo);
    } else {
      setEditedInfo(''); // Reset to empty when no info
    }
    setIsEditing(false); // Also reset editing state
  }, [familyData]);

  const canEdit = () => {
    if (!session?.user?.role) return false;

    const role = session.user.role;
    // Admin can always edit
    if (role === UserRole.ADMIN) return true;

    // Moderator can only edit when info is empty or null
    if (role === UserRole.MODERATOR) {
      return !familyData?.familyInfo || familyData.familyInfo.trim() === '';
    }

    return false;
  };

  const handleSave = async () => {
    try {
      await updateFamilyData(Number(id), editedInfo);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating family info:', err);
    }
  };

  if (loading && !familyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-bold text-xl mb-2">خطأ</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!familyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-white">لم يتم العثور على بيانات العائلة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Banner Image */}
      <div className="relative w-full h-96 md:h-[500px] lg:h-[600px]">
        <Image
          src={bannerImage}
          alt={familyData.familyName}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
              {familyData.familyName}
            </h1>
            <p className="text-lg md:text-xl text-gray-200">معلومات العائلة</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            {canEdit() && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
              >
                تعديل
              </button>
            )}
          </div>

          {isEditing ? (
            <div>
              <textarea
                value={editedInfo}
                onChange={(e) => setEditedInfo(e.target.value)}
                className="w-full min-h-[300px] p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                dir="rtl"
                placeholder="أدخل معلومات العائلة..."
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  حفظ
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedInfo(familyData.familyInfo || '');
                  }}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          ) : familyData.familyInfo && familyData.familyInfo.trim() !== '' ? (
            <div
              className="prose max-w-none text-white leading-relaxed whitespace-pre-wrap"
              dir="rtl"
            >
              {familyData.familyInfo}
            </div>
          ) : (
            <p className="text-white text-center py-8">
              لم يتم إضافة معلومات لهذه العائلة بعد
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
