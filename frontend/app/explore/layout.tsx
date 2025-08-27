import { Footer, Header } from "@/components";

export default async function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <Header />
        <div className="flex flex-col bg-custom-light-secondcolor dark:bg-custom-dark-secondcolor">
          {children}
        </div>
      <Footer />
    </>
  );
}
