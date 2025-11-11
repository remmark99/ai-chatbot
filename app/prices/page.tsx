import { Prices } from "@/components/prices";
import { auth } from "../(auth)/auth";

export default async function PricesPage() {
  const session = await auth();
  return <Prices session={session} />;
}
