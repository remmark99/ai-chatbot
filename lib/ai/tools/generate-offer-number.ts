import { tool } from "ai";
import { z } from "zod";
import {
  generateOfferNumber as fetchOfferNumberFromDB,
  incrementOfferNumber,
} from "@/lib/db/queries";

export const generateOfferNumber = tool({
  description:
    "Generate new offer number, only use this when user does not specify it. If user asks to change offer number, don't call this tool. Only call this when user does not specify what it should be",
  inputSchema: z.object({
    templateName: z
      .enum(["emonaev", "remmark", "sdk"])
      .describe(
        "Организация, от лица которой мы выставляем коммерческое предложение",
      ),
  }),
  execute: async ({ templateName }) => {
    const offerNumber = await fetchOfferNumberFromDB({ templateName });
    incrementOfferNumber({ templateName });

    return offerNumber;
  },
});
