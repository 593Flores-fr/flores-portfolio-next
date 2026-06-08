import { AdminProjetOptions } from "@/components/ui/admin-projet-options";

export default async function AdminProjetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminProjetOptions projectId={id} />;
}
