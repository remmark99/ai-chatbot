"use server";

import { auth } from "@/app/(auth)/auth";
import { getPriceRequests } from "./db/queries";

export async function fetchPriceRequests() {
  const session = await auth();
  return getPriceRequests(session?.user.id);
}
