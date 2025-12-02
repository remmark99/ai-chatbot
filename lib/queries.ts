"use server";

import { auth } from "@/app/(auth)/auth";
import { getPriceRequests } from "./db/queries";

export async function fetchPriceRequests() {
  const session = await auth();
  const priceRequests = await getPriceRequests(session?.user.id);

  return priceRequests.map((priceRequest) => {
    const websites = [];
    if (priceRequest.isIPro) websites.push("ipro");
    if (priceRequest.isVse) websites.push("vse");
    if (priceRequest.isRs) websites.push("rs");

    return { ...priceRequest, websites };
  });
}
