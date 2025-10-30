"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import DatePicker from "@/components/ui/date-picker";
import FileInputButton from "@/components/ui/file-input-button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Plus } from "lucide-react";
import Form from "next/form";
import { useActionState, useEffect, useState } from "react";

export default function PricesPage() {
  const [otp, setOtp] = useState("");
  const [isProcurementCreationFormOpen, setIsProcurementCreationFormOpen] =
    useState(false);

  // Check if OTP is complete (assuming length 4 or change to your OTP length)
  const isCompleted = otp.length === 4;

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
      setIsLoading(true);

      await fetch(
        "https://n8n-chatbot.remmark.ru/webhook/064f811a-6339-40a4-94a6-f5c8379ec398",
        {
          method: "POST",
          body: formData,
        },
      );

      setIsLoading(false);

      return { showOTP: true };
    },
    {
      showOTP: false,
    },
  );

  const toggleProcurementCreationForm = () =>
    setIsProcurementCreationFormOpen((old) => !old);

  return (
    <div className="m-auto space-y-2 w-4/5">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button onClick={toggleProcurementCreationForm}>
            Добавить <Plus />
          </Button>
          <Input placeholder="Поиск..." />
        </div>
        <div className="flex gap-2">
          <DatePicker />
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Сайт" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {isProcurementCreationFormOpen && (
        <Form
          action={formAction}
          className="space-y-2 bg-gray-100 border rounded-2xl p-8 flex justify-between"
        >
          <div className="w-2/5 flex flex-col gap-2">
            <Input placeholder="Название..." name="name" />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Список сайтов" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="self-end">
            <FileInputButton />
          </div>
        </Form>
      )}
      {state.showOTP && (
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
      )}
      <div className="grid grid-cols-2 gap-x-5 gap-y-3">
        <div className="rounded-2xl border bg-gray-100 p-4 flex flex-col justify-between h-[150px]">
          <div className="flex justify-between">
            <div className="space-x-2">
              <span>12:00</span>
              <span>01.01.2026</span>
            </div>
            <Badge>Статус</Badge>
          </div>
          <div>Hello world</div>
        </div>
        <div className="rounded-2xl border bg-gray-100 p-4 flex flex-col justify-between h-[150px]">
          <div className="flex justify-between">
            <div className="space-x-2">
              <span>12:00</span>
              <span>01.01.2026</span>
            </div>
            <Badge>Статус</Badge>
          </div>
          <div>Hello world</div>
        </div>
        <div className="rounded-2xl border bg-gray-100 p-4 flex flex-col justify-between h-[150px]">
          <div className="flex justify-between">
            <div className="space-x-2">
              <span>12:00</span>
              <span>01.01.2026</span>
            </div>
            <Badge>Статус</Badge>
          </div>
          <div>Hello world</div>
        </div>
      </div>
    </div>
  );
}
