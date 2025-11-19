import { Prices } from "@/components/prices";
import { auth } from "../(auth)/auth";
import { redirect } from "next/navigation";

export default async function PricesPage() {
  const session = await auth();

  if (!session || session.user.type === "guest") {
    redirect("/login");
  }

  return <Prices session={session} />;
}
