import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { EspaceClient } from "@/components/ui/espace-client";

export default async function EspacePage() {
  const session = await auth();
  if (!session?.user) redirect("/");
  return <EspaceClient user={session.user} />;
}
