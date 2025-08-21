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

      <main 
      // className="flex-1 px-52 sm:px-10 xl:px-52 bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor overflow-auto"
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}