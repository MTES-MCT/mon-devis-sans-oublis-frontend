import { quoteService } from "@/lib/client/apiWrapper";
import { EditClient } from "@/page-sections";

type DeleteErrorReason = {
  id: string;
  label: string;
};

export default async function Modifier({
  params: initialParams,
}: {
  params: Promise<{ profile: string; quoteCheckId: string }>;
}) {
  const params = await initialParams;

  if (!params.quoteCheckId) {
    console.error("Erreur : quoteCheckId est undefined !");
  }

  let deleteErrorReasons: DeleteErrorReason[] = [];
  try {
    deleteErrorReasons = await quoteService.getDeleteErrorDetailReasons();
  } catch (error) {
    console.error("Error fetching delete error reasons:", error);
  }

  return <EditClient deleteErrorReasons={deleteErrorReasons} params={params} />;
}
