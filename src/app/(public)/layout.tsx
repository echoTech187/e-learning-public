import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { cookies } from 'next/headers';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const userCookie = cookieStore.get('user')?.value;
  const isLoggedIn = !!token;
  const user = userCookie ? JSON.parse(userCookie) : null;
  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} user={user} />
      {children}
      <Footer />
    </>
  );
}
