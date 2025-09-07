import { Footer, Navbar } from "@/components";

export default async function CategoriesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <Navbar />
        <div className="flex flex-col bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor">
          {children}
        </div>
      <Footer />
    </>
  );
}
