import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { getSiteConfig } from "@/lib/config-storage";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const session = verifySessionToken(token);

  if (!session) {
    redirect("/admin/login");
  }

  const config = await getSiteConfig();

  return <AdminDashboardClient initialConfig={config} userEmail={session.email} />;
}
