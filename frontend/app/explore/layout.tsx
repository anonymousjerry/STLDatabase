export default async function ExploreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <div className="flex flex-col px-32 sm:px-10 xl:px-32 bg-gray-100">
        {children}
    </div>
  );
}
