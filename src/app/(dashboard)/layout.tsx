import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const userStr = cookieStore.get("user")?.value;

  if (!token || !userStr) redirect("/masuk");

  let user = { name: "", role: "" };
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    redirect("/masuk");
  }

  return (
    <div className="dashboard-layout">
      <DashboardSidebar user={user} />
      <main className="dashboard-main">
        <div className="dashboard-content">{children}</div>
      </main>
    </div>
  );
}
