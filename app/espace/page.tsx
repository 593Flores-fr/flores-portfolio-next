import { auth } from "@/auth";
import { EspaceClient } from "@/components/ui/espace-client";
import { EspaceGate } from "@/components/ui/espace-gate";

export default async function EspacePage() {
  const session = await auth();
  if (!session?.user) return <EspaceGate />;
  const isAdmin = session.user.email === process.env.ADMIN_EMAIL;
  return <EspaceClient user={session.user} isAdmin={isAdmin} />;
}
