import { TemplateProps } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import React from "react";

const EmonaevPDFTemplate = ({
  headerRef,
  footerRef,
  sum,
  children,
  content,
  showInResponseTo,
}: TemplateProps) => {
  const listItems = [
    `Срок действия предложения: до ${content.offerValidityPeriod}`,
    `Срок поставки товара: в срок до ${content.deliveryPeriod} (включительно).`,
    `Место поставки товара: ${content.deliveryAddress}`,
    `Цена включает в себя: стоимость Товара, расходы, связанные с доставкой, разгрузкой-погрузкой, размещением в местах хранения Заказчика, стоимость упаковки (тары), маркировки, страхование, таможенные платежи (пошлины), НДС, другие установленные налоги, сборы и иные расходы, связанные с исполнением Контракта.`,
    `Гарантийный срок исчисляется с момента подписания документа о приемке и составляет 12 (двенадцать) месяцев.`,
  ];
  let currIndex = 0;

  return (
    <div
      style={{ fontFamily: "Roboto" }}
      className="w-[850px] text-xs bg-white tracking-wide relative text-black"
    >
      {/* Header */}
      <div
        ref={headerRef}
        style={{ fontFamily: "Roboto" }}
        className="tracking-wide text-xs p-10 w-[850px]"
      >
        <div className="font-bold text-center italic text-xl">
          Индивидуальный предприниматель
          <br />
          <span className="uppercase">Емонаев Виталий Сергеевич</span>
          <br />
          ИНН 860239103291 ОГРНИП 315861700013774
          <br />
          628426, Россия, Ханты-Мансийский Автономный округ – Югра,
          <br />
          г. Сургут, проспект Мира, д. 44, кв. 79
        </div>

        <hr className="mt-4 border-t border-black" />

        <div className="flex justify-end mt-4">
          <div className="whitespace-pre-wrap text-right max-w-[160px]">
            {content.receiver}
          </div>
        </div>

        {/*
        <p className="mt-4 text-center">Уважаемый Павел Михайлович!</p>
        */}

        {showInResponseTo && (
          <div className="text-left mt-4">
            В ответ на Ваш запрос от {content.customerRequestDate} №{" "}
            {content.customerRequestNumber}.
          </div>
        )}
      </div>

      {/* Table */}
      {children}

      {/* Totals */}
      <div className="flex justify-end mt-3">
        <div className="grid grid-cols-2 gap-x-6">
          <div className="text-right font-medium">Итого:</div>
          <div className="text-right">{formatNumber(sum)}</div>
        </div>
      </div>

      {/* Bottom text (условия) */}
      <div
        ref={footerRef}
        className="tracking-wide text-xs p-10 w-[850px] z-10"
        style={{ fontFamily: "Roboto" }}
      >
        <div className="mt-3">
          <ol className="ml-6 list-none">
            {listItems.map((text, index) => {
              if (content.itemsToShow[index] === true) currIndex++;
              return content.itemsToShow[index] ? (
                <li key={index}>
                  {currIndex}. {text}
                </li>
              ) : null;
            })}
          </ol>
        </div>

        {/* Signature */}
        <div className="mt-12 flex gap-4 relative">
          <span>ИП Емонаев В.С.</span>
          <img
            alt="Подпись Емонаев"
            src="/images/emonaev-seal.png"
            className="absolute -top-8 left-[120px] z-0"
            width={100}
            height={100}
          />
          <div className="w-32 border-t border-black absolute top-5 left-[100px]" />
          <span className="text-right relative top-4">
            действует без печати
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmonaevPDFTemplate;
