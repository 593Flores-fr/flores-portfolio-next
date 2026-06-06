import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminShell } from "@/components/ui/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) redirect("/");
  return <AdminShell>{children}</AdminShell>;
}
