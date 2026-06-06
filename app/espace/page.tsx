import { auth } from "@/auth";
import { EspaceClient } from "@/components/ui/espace-client";
import { EspaceGate } from "@/components/ui/espace-gate";

export default async function EspacePage() {
  const session = await auth();
  if (!session?.user) return <EspaceGate />;
  return <EspaceClient user={session.user} />;
}
