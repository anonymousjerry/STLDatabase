import React from 'react';
import { Metadata } from 'next';
import { Footer, Navbar } from "@/components";

export const metadata: Metadata = {
  title: '3D Printing Blog - 3DDatabase.com',
  description: 'Discover tips, tutorials, and insights from the world of 3D printing.',
  keywords: ['3D printing', 'STL files', '3D models', 'blog', 'tutorials', 'news'],
  alternates: {
    canonical: 'https://3ddatabase.com/blog'
  },
  openGraph: {
    title: '3D Printing Blog - 3DDatabase.com',
    description: 'Discover tips, tutorials, and insights from the world of 3D printing.',
    url: 'https://3ddatabase.com/blog',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D Printing Blog - 3DDatabase.com',
    description: 'Discover tips, tutorials, and insights from the world of 3D printing.'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default async function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <main>
        {children}
      </main>

      <Footer />
    </div>
  );
}