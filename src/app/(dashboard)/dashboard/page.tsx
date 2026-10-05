import { cookies } from "next/headers";
import DashboardMurid from "./components/DashboardMurid";
import DashboardOrtu from "./components/DashboardOrtu";
import DashboardUmum from "./components/DashboardUmum";
import DashboardMentor from "./components/DashboardMentor";
import DashboardAdmin from "./components/DashboardAdmin";

export default async function DashboardRoot() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  let userRole = "student";

  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      userRole = user.role;
    } catch (e) {}
  }

  if (userRole === "admin") return <DashboardAdmin />;
  if (userRole === "mentor") return <DashboardMentor />;
  if (userRole === "parent") return <DashboardOrtu />;
  if (userRole === "general") return <DashboardUmum />;
  
  return <DashboardMurid />;
}
