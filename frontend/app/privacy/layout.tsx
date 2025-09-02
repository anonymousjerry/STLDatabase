import { Footer, Header } from "@/components";

export default async function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="flex flex-col bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor">
        {children}
      </main>

      <Footer />
    </div>
  );
}