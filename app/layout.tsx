import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header";

export const metadata: Metadata = { title: "বাজার দর", description: "প্রয়োজনীয় পণ্যের দাম এক নজরে" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="bn"><body><AuthProvider><Header />{children}</AuthProvider></body></html>; }
