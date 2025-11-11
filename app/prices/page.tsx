import { Prices } from "@/components/prices";
import { auth } from "../(auth)/auth";

export default async function PricesPage() {
  const session = await auth();
  console.log(session);
  return <Prices session={session} />;
}
