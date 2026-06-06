import { AdminProjetDetail } from "@/components/ui/admin-projet-detail";

export default async function AdminProjetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminProjetDetail projectId={id} />;
}
