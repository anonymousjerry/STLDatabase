import { Footer, Navbar } from "@/components";

export default async function ContactLayout({
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