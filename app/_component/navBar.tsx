"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, UserRoundPen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

interface NavBarClientProps {
  isAdmin: boolean;
}

export default function NavBarClient({ isAdmin }: NavBarClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-primary/90 text-white font-amiri relative ">
      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header with Hamburger */}
        <div className="flex justify-between items-center h-14 px-4">
          <h1 className="text-lg font-bold text-white">قبيلة آل العبد</h1>
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="القائمة"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-14 left-0 right-0 bg-primary/95 shadow-lg z-50 border-t border-white/10">
            <ul className="flex flex-col font-medium text-base">
              <li>
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="block py-3 px-6 hover:bg-white/10 hover:text-amber-400 transition-colors text-right border-b border-white/5"
                >
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  onClick={closeMenu}
                  className="block py-3 px-6 hover:bg-white/10 hover:text-amber-400 transition-colors text-right border-b border-white/5"
                >
                  مجتمع القبيلـة
                </Link>
              </li>
              <li>
                <Link
                  href="/called"
                  onClick={closeMenu}
                  className="block py-3 px-6 hover:bg-white/10 hover:text-amber-400 transition-colors text-right border-b border-white/5"
                >
                  القاب وعزاوي ال العبد
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  onClick={closeMenu}
                  className="block py-3 px-6 hover:bg-white/10 hover:text-amber-400 transition-colors text-right border-b border-white/5"
                >
                  من نحن
                </Link>
              </li>
              {session ? (
                <li>
                  <Button
                    onClick={() => signOut({ redirectTo: "/login" })}
                    className="block py-3 px-6 text-red-500 hover:bg-white/10 hover:text-amber-400 transition-colors text-right border-b border-white/5"
                  >
                    تسجيل الخروج
                  </Button>
                </li>
              ) : (
                <li className="  block py-3 px-6 hover:bg-white/10 hover:text-amber-400 transition-colors text-right border-b border-white/5">
                  <Link href="/login">قم بتسجيل الدخول</Link>
                </li>
              )}
              {isAdmin && (
                <li>
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="block py-3 px-6 hover:bg-white/10 hover:text-amber-400 transition-colors text-right"
                  >
                    لوحة التحكم
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Desktop Navigation */}
      <ul
        className="hidden md:flex justify-center items-center gap-6 lg:gap-8 h-16 font-medium text-base lg:text-xl px-4 "
        dir="rtl"
      >
        <li>
          <Link href="/" className="hover:text-amber-400 transition-colors">
            الرئيسية
          </Link>
        </li>
        <li>
          <Link
            href="/posts"
            className="hover:text-amber-400 transition-colors"
          >
            مجتمع القبيلـة
          </Link>
        </li>
        <li>
          <Link
            href="/called"
            className="hover:text-amber-400 transition-colors"
          >
            القاب وعزاوي ال العبد
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className="hover:text-amber-400 transition-colors"
          >
            من نحن
          </Link>
        </li>

        {/* <li>
          <Link
            href="/profile"
            className="hover:text-amber-400 transition-colors"
          >
            <UserRoundPen />
          </Link>
        </li> */}

        {session ? (
          <li>
            <Button
              onClick={() => signOut({ redirectTo: "/login" })}
              className="text-red-500 bg-white hover:bg-red-600 hover:text-white   transition-colors text-lg font-semibold"
            >
              تسجيل الخروج
            </Button>
          </li>
        ) : (
          <Button className=" bg-white text-primary hover:bg-amber-400 hover:text-white transition-colors text-lg font-semibold">
            <Link href="/login">قم بتسجيل الدخول</Link>
          </Button>
        )}
        {isAdmin && (
          <li>
            <Link
              href="/dashboard"
              className="  hover:text-amber-400 transition-colors"
            >
              لوحة التحكم
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
