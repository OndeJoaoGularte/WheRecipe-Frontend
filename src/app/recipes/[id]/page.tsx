import { redirect } from "next/navigation";

export default async function LegacyRecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/receitas/${id}`);
}
