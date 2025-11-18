import { auth } from "../(auth)/auth";
import { redirect } from "next/navigation";
import Settings from "@/components/settings";

export default async function SettingsPage() {
  const session = await auth();

  console.log(session);
  if (!session || session.user.type === "guest") {
    redirect("/login");
  }

  return <Settings session={session} />;
}
