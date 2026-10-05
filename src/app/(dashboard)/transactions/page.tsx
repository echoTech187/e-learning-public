import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TransactionHistoryClient from "./TransactionHistoryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riwayat Transaksi & Pembelian - EduNusa",
  description: "Pantau status pembelian kursus dan unduh bukti transaksi invoice resmi di EduNusa.",
};

export default async function TransaksiPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userStr = cookieStore.get("user")?.value;

  if (!token || !userStr) {
    redirect("/masuk");
  }

  let user = { id: "", name: "Siswa EduNusa", email: "user@edunusa.id", role: "student" };
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    redirect("/masuk");
  }

  return <TransactionHistoryClient initialOrders={[]} user={user} />;
}
