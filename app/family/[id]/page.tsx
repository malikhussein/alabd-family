"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useFamilyDataStore from "../../store/family-data";
import { useSession } from "next-auth/react";
import Image from "next/image";
import bannerImage from "../../../public/images/Frame 8.png";
import { UserRole } from "../../../entities/user.entity";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PersonEntry {
  id?: number;
  name: string;
  description: string;
  era?: string;
}

// ─── Icon Components ──────────────────────────────────────────────────────────
const QuillIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const ScrollIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

// ─── Ornamental Divider ───────────────────────────────────────────────────────
const OrnamentalDivider = () => (
  <div className="flex items-center gap-3 my-2">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
    <div className="flex gap-1 items-center">
      <span className="w-1.5 h-1.5 rotate-45 bg-amber-400/70 inline-block" />
      <span className="w-2.5 h-2.5 rotate-45 bg-amber-400 inline-block" />
      <span className="w-1.5 h-1.5 rotate-45 bg-amber-400/70 inline-block" />
    </div>
    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-amber-400/50 to-transparent" />
  </div>
);

// ─── Person Card ──────────────────────────────────────────────────────────────
const PersonCard = ({
  person,
  canEdit,
  onEdit,
  onDelete,
}: {
  person: PersonEntry;
  canEdit: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div
    className="relative group rounded-xl border border-amber-400/20 bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm p-5 transition-all duration-300 hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-400/10"
    style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }}
  >
    {/* Corner ornament */}
    <span className="absolute top-2 right-2 w-2 h-2 rotate-45 bg-amber-400/30 group-hover:bg-amber-400/60 transition-colors" />
    <span className="absolute bottom-2 left-2 w-2 h-2 rotate-45 bg-amber-400/30 group-hover:bg-amber-400/60 transition-colors" />

    <div className="flex justify-between items-start gap-2">
      <div className="flex-1 text-right">
        <h3 className="text-amber-300 font-bold text-lg leading-snug">{person.name}</h3>
        {person.era && (
          <span className="inline-block mt-1 text-xs text-amber-400/60 border border-amber-400/20 rounded-full px-2 py-0.5">
            {person.era}
          </span>
        )}
        <p className="mt-2 text-stone-300 text-sm leading-relaxed">{person.description}</p>
      </div>
    </div>

    {canEdit && (
      <div className="flex gap-2 mt-3 justify-start opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onEdit}
          className="p-1.5 rounded-md bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 transition-colors"
        >
          <EditIcon />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-md bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
        >
          <TrashIcon />
        </button>
      </div>
    )}
  </div>
);

// ─── Person Form Modal ────────────────────────────────────────────────────────
const PersonFormModal = ({
  title,
  initial,
  onSave,
  onClose,
}: {
  title: string;
  initial?: PersonEntry;
  onSave: (p: PersonEntry) => void;
  onClose: () => void;
}) => {
  const [form, setForm] = useState<PersonEntry>(
    initial || { name: "", description: "", era: "" }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-md rounded-2xl border border-amber-400/30 bg-stone-900 p-6 shadow-2xl shadow-amber-400/10"
        dir="rtl"
        style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }}
      >
        <h2 className="text-amber-400 text-xl font-bold mb-4">{title}</h2>
        <OrnamentalDivider />
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-stone-300 text-sm block mb-1">الاسم *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white/5 border border-amber-400/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400/60 transition-colors"
              placeholder="أدخل الاسم..."
            />
          </div>
          <div>
            <label className="text-stone-300 text-sm block mb-1">الحقبة الزمنية</label>
            <input
              value={form.era || ""}
              onChange={(e) => setForm({ ...form, era: e.target.value })}
              className="w-full bg-white/5 border border-amber-400/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400/60 transition-colors"
              placeholder="مثال: القرن العاشر الهجري"
            />
          </div>
          <div>
            <label className="text-stone-300 text-sm block mb-1">نبذة *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full bg-white/5 border border-amber-400/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400/60 transition-colors resize-none"
              placeholder="أدخل نبذة مختصرة..."
            />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button
            onClick={() => {
              if (form.name.trim() && form.description.trim()) onSave(form);
            }}
            className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold transition-colors"
          >
            حفظ
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Section Component ────────────────────────────────────────────────────────
const FamilySection = ({
  title,
  subtitle,
  icon,
  people,
  canEdit,
  onAdd,
  onEdit,
  onDelete,
  emptyMessage,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  people: PersonEntry[];
  canEdit: boolean;
  onAdd: () => void;
  onEdit: (idx: number) => void;
  onDelete: (idx: number) => void;
  emptyMessage: string;
}) => (
  <section className="mt-12">
    {/* Section Header */}
    <div className="flex items-center justify-between mb-2" dir="rtl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full border border-amber-400/40 bg-amber-400/10 flex items-center justify-center text-amber-400">
          {icon}
        </div>
        <div>
          <h2
            className="text-2xl font-bold text-amber-300 leading-none"
            style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }}
          >
            {title}
          </h2>
          <p className="text-stone-400 text-xs mt-0.5">{subtitle}</p>
        </div>
      </div>
      {canEdit && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-sm transition-all"
        >
          <PlusIcon />
          <span>إضافة</span>
        </button>
      )}
    </div>

    <OrnamentalDivider />

    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {people.length > 0 ? (
        people.map((p, i) => (
          <PersonCard
            key={i}
            person={p}
            canEdit={canEdit}
            onEdit={() => onEdit(i)}
            onDelete={() => onDelete(i)}
          />
        ))
      ) : (
        <p
          className="col-span-2 text-center py-10 text-stone-500 italic"
          style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }}
        >
          {emptyMessage}
        </p>
      )}
    </div>
  </section>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FamilyInfo() {
  const { data: session } = useSession();
  const { id } = useParams();

  // Main info state
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState("");

  // Sections state (would ideally come from store / API)
  const [poets, setPoets] = useState<PersonEntry[]>([]);
  const [icons, setIcons] = useState<PersonEntry[]>([]);
  const [sheikhs, setSheikhs] = useState<PersonEntry[]>([]);

  // Modal state
  const [modal, setModal] = useState<{
    section: "poets" | "icons" | "sheikhs" | null;
    editIdx: number | null;
  }>({ section: null, editIdx: null });

  const { familyData, loading, error, fetchOneFamilyData, updateFamilyData } =
    useFamilyDataStore();

  useEffect(() => {
    if (id) fetchOneFamilyData(Number(id));
  }, [id, fetchOneFamilyData]);

  useEffect(() => {
    if (familyData?.familyInfo) {
      setEditedInfo(familyData.familyInfo);
    } else {
      setEditedInfo("");
    }
    setIsEditing(false);
  }, [familyData]);

  const canEdit = () => {
    if (!session?.user?.role) return false;
    const role = session.user.role;
    if (role === UserRole.ADMIN) return true;
    if (role === UserRole.MODERATOR) {
      return !familyData?.familyInfo || familyData.familyInfo.trim() === "";
    }
    return false;
  };

  const handleSave = async () => {
    try {
      await updateFamilyData(Number(id), editedInfo);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating family info:", err);
    }
  };

  // Section helpers
  const sectionData = {
    poets: { list: poets, set: setPoets },
    icons: { list: icons, set: setIcons },
    sheikhs: { list: sheikhs, set: setSheikhs },
  };

  const handleModalSave = (person: PersonEntry) => {
    if (!modal.section) return;
    const { list, set } = sectionData[modal.section];
    if (modal.editIdx !== null) {
      const updated = [...list];
      updated[modal.editIdx] = person;
      set(updated);
    } else {
      set([...list, person]);
    }
    setModal({ section: null, editIdx: null });
  };

  const handleDelete = (section: keyof typeof sectionData, idx: number) => {
    const { list, set } = sectionData[section];
    set(list.filter((_, i) => i !== idx));
  };

  if (loading && !familyData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #1c1410 0%, #2d1f0e 50%, #1c1410 100%)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p
            className="text-amber-400/70 text-lg"
            style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }}
          >
            جاري التحميل...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #1c1410 0%, #2d1f0e 50%, #1c1410 100%)" }}
      >
        <div className="text-center">
          <p className="text-red-400 text-xl font-bold mb-2">خطأ</p>
          <p className="text-stone-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!familyData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #1c1410 0%, #2d1f0e 50%, #1c1410 100%)" }}
      >
        <p
          className="text-stone-400 text-lg"
          style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }}
        >
          لم يتم العثور على بيانات العائلة
        </p>
      </div>
    );
  }

  const getModalInitial = () => {
    if (!modal.section || modal.editIdx === null) return undefined;
    return sectionData[modal.section].list[modal.editIdx];
  };

  const modalTitles = {
    poets: "إضافة / تعديل شاعر",
    icons: "إضافة / تعديل رمز",
    sheikhs: "إضافة / تعديل شيخ",
  };

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');

        .geo-pattern {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='%23b45309' stroke-opacity='0.08' stroke-width='0.5'/%3E%3Cpath d='M30 10 L50 30 L30 50 L10 30 Z' fill='none' stroke='%23b45309' stroke-opacity='0.06' stroke-width='0.5'/%3E%3C/svg%3E");
        }

        .section-reveal {
          animation: fadeUp 0.6s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="min-h-screen geo-pattern"
        style={{ background: "linear-gradient(160deg, #18110a 0%, #26180a 40%, #1a120c 100%)" }}
      >
        {/* ── Banner ───────────────────────────────────────────────────────── */}
        <div className="relative w-full h-56 sm:h-72 overflow-hidden">
          <Image
            src={bannerImage}
            alt="family banner"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#18110a]" />

          {/* Family name overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center px-4">
              <p
                className="text-amber-400/70 text-sm tracking-widest uppercase mb-1"
                style={{ fontFamily: "'Scheherazade New', serif", letterSpacing: "0.3em" }}
              >
                ✦ عائلة ✦
              </p>
              <h1
                className="text-4xl sm:text-5xl font-bold text-amber-300 drop-shadow-2xl"
                style={{ fontFamily: "'Scheherazade New', 'Amiri', serif", textShadow: "0 2px 20px rgba(180,83,9,0.6)" }}
              >
                {familyData.familyName}
              </h1>
            </div>
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">

          {/* ── Family Info Section ─────────────────────────────────────────── */}
          <section className="section-reveal mt-8">
            {/* Header row */}
            <div className="flex items-center justify-between mb-2" dir="rtl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-amber-400/40 bg-amber-400/10 flex items-center justify-center text-amber-400">
                  <ScrollIcon />
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold text-amber-300 leading-none"
                    style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }}
                  >
                    معلومات العائلة
                  </h2>
                  <p className="text-stone-400 text-xs mt-0.5">نسب وتاريخ</p>
                </div>
              </div>
              {canEdit() && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-sm transition-all"
                >
                  <EditIcon />
                  <span>تعديل</span>
                </button>
              )}
            </div>

            <OrnamentalDivider />

            <div
              className="mt-5 rounded-2xl border border-amber-400/15 bg-gradient-to-b from-white/[0.04] to-transparent backdrop-blur-sm p-6"
              dir="rtl"
            >
              {isEditing ? (
                <div>
                  <textarea
                    value={editedInfo}
                    onChange={(e) => setEditedInfo(e.target.value)}
                    className="w-full min-h-[260px] bg-white/5 border border-amber-400/20 rounded-xl p-4 text-stone-200 focus:outline-none focus:border-amber-400/50 transition-colors resize-none"
                    placeholder="أدخل معلومات العائلة..."
                    style={{ fontFamily: "'Scheherazade New', 'Amiri', serif", lineHeight: 2 }}
                  />
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold transition-colors"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedInfo(familyData.familyInfo || "");
                      }}
                      className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-stone-300 transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : familyData.familyInfo?.trim() ? (
                <p
                  className="text-stone-300 leading-loose text-lg whitespace-pre-wrap"
                  style={{ fontFamily: "'Scheherazade New', 'Amiri', serif", lineHeight: 2.2 }}
                >
                  {familyData.familyInfo}
                </p>
              ) : (
                <p
                  className="text-stone-500 text-center py-10 italic"
                  style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }}
                >
                  لم يتم إضافة معلومات لهذه العائلة بعد
                </p>
              )}
            </div>
          </section>

          {/* ── Poets Section ──────────────────────────────────────────────── */}
          {/* <div className="section-reveal" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <FamilySection
              title="شعراؤها"
              subtitle="أعلام الشعر والأدب"
              icon={<QuillIcon />}
              people={poets}
              canEdit={canEdit()}
              onAdd={() => setModal({ section: "poets", editIdx: null })}
              onEdit={(i) => setModal({ section: "poets", editIdx: i })}
              onDelete={(i) => handleDelete("poets", i)}
              emptyMessage="لم يُضف شعراء بعد"
            />
          </div> */}

          {/* ── Icons Section ───────────────────────────────────────────────── */}
          {/* <div className="section-reveal" style={{ animationDelay: "0.2s", opacity: 0 }}>
            <FamilySection
              title="رموزها"
              subtitle="أبرز الشخصيات والأعلام"
              icon={<StarIcon />}
              people={icons}
              canEdit={canEdit()}
              onAdd={() => setModal({ section: "icons", editIdx: null })}
              onEdit={(i) => setModal({ section: "icons", editIdx: i })}
              onDelete={(i) => handleDelete("icons", i)}
              emptyMessage="لم يُضف رموز بعد"
            />
          </div> */}

          {/* ── Sheikhs Section ─────────────────────────────────────────────── */}
          {/* <div className="section-reveal" style={{ animationDelay: "0.3s", opacity: 0 }}>
            <FamilySection
              title="شيوخها"
              subtitle="العلماء والمشايخ"
              icon={<ScrollIcon />}
              people={sheikhs}
              canEdit={canEdit()}
              onAdd={() => setModal({ section: "sheikhs", editIdx: null })}
              onEdit={(i) => setModal({ section: "sheikhs", editIdx: i })}
              onDelete={(i) => handleDelete("sheikhs", i)}
              emptyMessage="لم يُضف مشايخ بعد"
            />
          </div> */}
          
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {modal.section && (
        <PersonFormModal
          title={modalTitles[modal.section]}
          initial={getModalInitial()}
          onSave={handleModalSave}
          onClose={() => setModal({ section: null, editIdx: null })}
        />
      )}
    </>
  );
}