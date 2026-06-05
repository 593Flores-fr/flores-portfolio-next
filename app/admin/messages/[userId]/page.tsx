import { AdminConversation } from "@/components/ui/admin-conversation";

export default async function AdminConversationPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <AdminConversation userId={userId} />;
}
