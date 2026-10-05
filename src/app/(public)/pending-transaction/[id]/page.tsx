import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TransactionDetailClient from "@/app/(public)/pending-transaction/[id]/TransactionDetailClient";

export default async function PendingTransactionPage({ params }: { params: Promise<{ id: string }> }) {
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

  return (
    <div className="container py-5 mt-5" style={{ minHeight: "80vh" }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <TransactionDetailClient orderCode={resolvedParams.id} user={user} />
        </div>
      </div>
    </div>
  );
}
