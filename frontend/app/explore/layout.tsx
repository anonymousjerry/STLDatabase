export default async function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex flex-col px-52 sm:px-10 xl:px-52 bg-gray-100">
        {children}
    </div>
  );
}
