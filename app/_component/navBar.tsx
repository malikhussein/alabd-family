import React from "react";
import Link from "next/link";

export default function NavBar() {
  return (
    <div className="bg-primary/90 o h-14  text-white">
      <ul className="flex justify-center items-center gap-8 h-full font-medium text-xl">
        <Link href="/dashboard"> لوحة التحكم</Link>
        <Link href="/about">من نحن</Link>
        <Link href="/called">القاب وعزاوي ال العبد</Link>
        <Link href="/posts">مجتمع القبيلـة </Link>
        <Link href="/">الرئيسية</Link>{" "}
      </ul>
    </div>
  );
}
