import { Footer, Header } from "@/components";

export default async function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <Header />
        <div className="flex flex-col px-52 sm:px-10 xl:px-52 bg-gray-100">
          {children}
        </div>
      <Footer />
    </>
  );
}
