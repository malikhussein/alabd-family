import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { log } from "node:console";

export default async function NavBar() {
  const session = await auth();
  const user = session?.user.role;

  console.log(user);

  if (!session) {
    redirect("/login");
  }

  console.log(session);

  return (
    <div className="bg-primary/90 o h-14  text-white">
      <ul className="flex justify-center items-center gap-8 h-full font-medium text-xl">
      {
        user === "admin" || user === "moderator" ? (
          <Link href="/dashboard"> لوحة التحكم</Link>
        ) : null
      }
        <Link href="/about">من نحن</Link>
        <Link href="/called">القاب وعزاوي ال العبد</Link>
        <Link href="/posts">مجتمع القبيلـة </Link>
        <Link href="/">الرئيسية</Link>{" "}
      </ul>
    </div>
  );
}
