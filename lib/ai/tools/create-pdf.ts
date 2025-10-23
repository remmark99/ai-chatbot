import { tool } from "ai";
import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().describe("Name of the product"),
  characteristics: z
    .string()
    .describe("Characteristics of the product")
    .optional(),
  quantity: z.number(),
  price: z.number(),
});

export const PDFSchema = z
  .object({
    templateName: z
      .enum(["emonaev", "remmark", "sdk"])
      .describe(
        "Организация, от лица которой мы выставляем коммерческое предложение",
      ),
    filename: z.string(),
    products: z.array(ProductSchema),
    receiver: z.string().describe("Кому выписывается КП"),
    deliveryAddress: z.string().describe("Место поставки товара"),
    customerRequestNumber: z
      .string()
      .describe(
        "Номер запроса клиента, в ответ на ваш запрос №???, не должно быть символа №",
      ),
    customerRequestDate: z.string().describe("Дата запроса клиента"),
    offerValidityPeriod: z
      .string()
      .describe("Срок действия предложения, до какой даты действительно"),
    deliveryPeriod: z.string().describe("Дата поставки товара, до"),
    offerDate: z.string().describe("Дата КП"),
    offerNumber: z
      .string()
      .describe(
        "Номер КП, генерируй через generateOfferNumber если пользователь не передаст его сам вне файла",
      ),
    showCharacteristics: z
      .boolean()
      .describe(
        "Если в источнике нет характеристик товаров, не отображаем колонку характеристики в таблице",
      ),
    showInResponseTo: z
      .boolean()
      .describe(
        'Если пользователь просит не отображать "В ответ на" это должно быть false',
      ),
  })
  .superRefine((data, ctx) => {
    if (!data.showCharacteristics) {
      const invalid = data.products.find(
        (product) => product.characteristics !== undefined,
      );
      if (invalid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "If showCharacteristics is false, none of the products can have characteristics set.",
          path: ["products"],
        });
      }
    }
  });

export const showPdf = tool({
  description:
    "Отображает готовое коммерческое предложение в виде pdf-файла пользователю и дает ссылку на скачивание",
  inputSchema: PDFSchema,
  execute: async ({
    filename,
    products,
    templateName = "remmark",
    receiver,
    deliveryAddress,
    customerRequestNumber,
    customerRequestDate,
    offerValidityPeriod,
    deliveryPeriod,
    offerDate,
    offerNumber,
    showCharacteristics,
    showInResponseTo,
  }) => {
    return {
      filename,
      products,
      templateName,
      receiver,
      deliveryAddress,
      customerRequestNumber,
      customerRequestDate,
      offerValidityPeriod,
      deliveryPeriod,
      offerDate,
      offerNumber,
      showCharacteristics,
      showInResponseTo,
    };
  },
});

// Default export is a4 paper, portrait, using millimeters for units
