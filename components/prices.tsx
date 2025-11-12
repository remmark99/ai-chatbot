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
import { createClient } from "@/lib/supabase/client";

interface Props {
  session: Session;
}

const WEBSITE_OPTIONS = [
  { value: "ozon", label: "Ozon" },
  { value: "wildberries", label: "Wildberries" },
  { value: "yandex", label: "Yandex Market" },
  { value: "avito", label: "Avito" },
  { value: "aliexpress", label: "AliExpress" },
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
  const supabase = createClient();
  const { data: priceRequests } = useQuery({
    queryKey: ["priceRequests"],
    queryFn: fetchPriceRequests,
    refetchInterval: 5000,
  });

  const [otp, setOtp] = useState("");
  const [isProcurementCreationFormOpen, setIsProcurementCreationFormOpen] =
    useState(false);
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([]);

  // Check if OTP is complete (assuming length 4 or change to your OTP length)
  const isCompleted = otp.length === 4;

  const downloadFile = async (fileUrl: string) => {
    fetch(
      "http://supabasekong-boo0w0g0k40k8kwsw4g0sc0o.217.114.187.98.sslip.io/storage/v1/object/price-results/" +
        fileUrl,
      {
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2MDkzNTMyMCwiZXhwIjo0OTE2NjA4OTIwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.LWWpCAMuV_jmGChKjELEcFIC3xkZ3fAifzugHFc7PxY",
        },
      },
    );
    const { data, error } = await supabase.storage
      .from("price-results")
      .download(fileUrl);
    if (error) {
      console.error("Download error:", error);
      return;
    }
    // Create a URL for the downloaded Blob object
    const url = window.URL.createObjectURL(data);

    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = fileUrl; // use the fileUrl or parse from it to get a filename

    // Append anchor to body, trigger click and remove it
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Revoke the object URL after download to free memory
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (isCompleted) {
      // Fire web request here
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
  }, [isCompleted, otp]);
  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction] = useActionState<any, FormData>(
    async (a, formData) => {
      formData.set("user_id", session.user.id);
      formData.set("websites", JSON.stringify(selectedWebsites));
      setIsLoading(true);

      await fetch("http://146.103.103.157:8010/process-xlsx", {
        method: "POST",
        body: formData,
      });

      setIsLoading(false);
      setIsProcurementCreationFormOpen(false);
      setSelectedWebsites([]);

      return { showOTP: true };
    },
    {
      showOTP: false,
    },
  );

  const toggleProcurementCreationForm = () =>
    setIsProcurementCreationFormOpen((old) => !old);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-20 space-y-6">
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
          <Input placeholder="Поиск по названию..." className="w-64" />
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
        {priceRequests && priceRequests.length > 0 ? (
          priceRequests.map((priceRequest) => (
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
                      {/**
                      {priceRequest.websites && (
                        <span>Сайты: {priceRequest.websites.join(", ")}</span>
                      )}
                      **/}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!priceRequest.fileUrl}
                    onClick={() => downloadFile(priceRequest.fileUrl)}
                  >
                    Скачать файл
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                Нет активных запросов. Создайте новый запрос для начала работы.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
