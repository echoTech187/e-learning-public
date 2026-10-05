import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserOrders } from "@/app/actions/checkout";
import TransactionDetailClient from "./TransactionDetailClient";

export default async function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userStr = cookieStore.get("user")?.value;

  if (!token || !userStr) {
    redirect("/masuk");
  }

  let user = { id: "", name: "", email: "", role: "" };
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    redirect("/masuk");
  }

  return <TransactionDetailClient orderCode={resolvedParams.id} user={user} />;
}

