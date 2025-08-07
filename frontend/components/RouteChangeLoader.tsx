// components/RouteChangeLoader.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLoading } from "@/context/LoadingContext";

export default function RouteChangeLoader() {
  const pathname = usePathname();
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 300); // you can remove delay or adjust

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}
