"use server";

import { getPriceRequests } from "./db/queries";

export async function fetchPriceRequests() {
  return getPriceRequests();
}
