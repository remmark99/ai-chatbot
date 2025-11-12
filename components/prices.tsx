"use client";

import { fetchPriceRequests } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, Plus, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import DatePicker from "./ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Form from "next/form";
import FileInputButton from "./ui/file-input-button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Badge } from "./ui/badge";
import type { Session } from "next-auth";
import { Card, CardContent } from "./ui/card";

interface Props {
  session: Session;
}

const WEBSITE_OPTIONS = [
  { value: "ipro", label: "ЭТМ iPRO" },
  { value: "rs", label: "Русский Свет" },
  { value: "vse", label: "ВсеИнструменты" },
];

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export function Prices({ session }: Props) {
  const { data: priceRequests } = useQuery({
    queryKey: ["priceRequests"],
    queryFn: fetchPriceRequests,
    refetchInterval: 5000,
  });

  const [otp, setOtp] = useState("");
  const [isProcurementCreationFormOpen, setIsProcurementCreationFormOpen] =
    useState(false);
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction] = useActionState<any, FormData>(
    async (a, formData) => {
      formData.set("user_id", session.user.id);
      formData.set("websites", JSON.stringify(selectedWebsites));
      setIsLoading(true);

      try {
        const response = await fetch("/prices/api/process-xlsx", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("[v0] Failed to process XLSX:", data);
          setIsLoading(false);
          return { showOTP: false, error: data.error };
        }

        setIsLoading(false);
        setIsProcurementCreationFormOpen(false);
        setSelectedWebsites([]);

        return { showOTP: true, data };
      } catch (error) {
        console.error("[v0] Error submitting form:", error);
        setIsLoading(false);
        return { showOTP: false, error: "Failed to submit request" };
      }
    },
    {
      showOTP: false,
    },
  );

  useEffect(() => {
    if (otp.length === 4) {
      fetch(
        "https://n8n-chatbot.remmark.ru/webhook/63d43bec-7a17-4cac-a4f7-132685b0cd81",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp }),
        },
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("OTP verified:", data);
        })
        .catch((error) => {
          console.error("OTP verification error:", error);
        });
    }
  }, [otp]);

  const toggleProcurementCreationForm = () =>
    setIsProcurementCreationFormOpen((old) => !old);

  const filteredPriceRequests = priceRequests?.filter((request) =>
    request.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-6">
      {isProcurementCreationFormOpen && (
        <Card className="border-2">
          <CardContent className="pt-6">
            <Form action={formAction} className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <Input
                    placeholder="Введите название запроса..."
                    name="req_name"
                    className="text-base"
                    required
                  />

                  <div className="space-y-2">
                    <Select
                      value=""
                      onValueChange={(value) => {
                        if (!selectedWebsites.includes(value)) {
                          setSelectedWebsites([...selectedWebsites, value]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите сайты для парсинга..." />
                      </SelectTrigger>
                      <SelectContent>
                        {WEBSITE_OPTIONS.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            disabled={selectedWebsites.includes(option.value)}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedWebsites.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedWebsites.map((website) => (
                          <Badge
                            key={website}
                            variant="secondary"
                            className="px-3 py-1 text-sm"
                          >
                            {
                              WEBSITE_OPTIONS.find((w) => w.value === website)
                                ?.label
                            }
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedWebsites(
                                  selectedWebsites.filter((w) => w !== website),
                                )
                              }
                              className="ml-2 hover:text-destructive"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <FileInputButton />
                  <Button
                    type="submit"
                    disabled={isLoading || selectedWebsites.length === 0}
                  >
                    Запустить{" "}
                    {isLoading && (
                      <LoaderCircle className="ml-2 size-4 animate-spin" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={toggleProcurementCreationForm}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>
      )}

      {state.showOTP && (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Введите код подтверждения
            </p>
            <InputOTP
              maxLength={4}
              pattern={REGEXP_ONLY_DIGITS}
              value={otp}
              onChange={setOtp}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={toggleProcurementCreationForm}
            disabled={isProcurementCreationFormOpen}
          >
            <Plus className="mr-2 size-4" />
            Создать запрос
          </Button>
          <Input
            placeholder="Поиск по названию..."
            className="w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DatePicker />
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Фильтр по сайту" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все сайты</SelectItem>
              {WEBSITE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredPriceRequests && filteredPriceRequests.length > 0 ? (
          filteredPriceRequests.map((priceRequest) => (
            <Card
              key={priceRequest.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {priceRequest.name || "Без названия"}
                      </h3>
                      <Badge
                        variant={
                          priceRequest.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {priceRequest.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        Создан: {formatDateTime(priceRequest.createdAt)}
                      </span>
                      {priceRequest.websites && (
                        <span>Сайты: {priceRequest.websites.join(", ")}</span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Ничего не найдено. Попробуйте изменить поисковый запрос."
                  : "Нет активных запросов. Создайте новый запрос для начала работы."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
