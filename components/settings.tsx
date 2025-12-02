"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Store, Lock, Phone } from "lucide-react";
import { toast } from "sonner";
import { Session } from "next-auth";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";

interface Props {
  session: Session;
}

export default function Settings({ session }: Props) {
  const userId = session.user.id;

  const { data: userData, isLoading: isInitialLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const res = await fetch(`/settings/api/user-data`);
      if (!res.ok) throw new Error("Failed to fetch user data");
      return res.json();
    },
  });

  // RS Store state
  const [rsLogin, setRsLogin] = useState("");
  const [rsPass, setRsPass] = useState("");
  const [rsLoading, setRsLoading] = useState(false);

  // iPro Store state
  const [iproLogin, setIproLogin] = useState("");
  const [iproPass, setIproPass] = useState("");
  const [iproLoading, setIproLoading] = useState(false);

  // VSE Store state
  const [vseLogin, setVseLogin] = useState("");
  const [vsePass, setVsePass] = useState("");
  const [vseLoading, setVseLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setRsLogin(userData.rsLogin ?? "");
      setRsPass(userData.rsPass ?? "");
      setIproLogin(userData.iproLogin ?? "");
      setIproPass(userData.iproPass ?? "");
      setVseLogin(userData.vseLogin ?? "");
      setVsePass(userData.vsePass ?? "");
    }
  }, [userData]);

  const saveRsCredentials = async () => {
    if (!rsLogin || !rsPass) {
      toast.error("Please fill in all RS Store fields");
      return;
    }

    setRsLoading(true);
    try {
      const response = await fetch("/settings/api/user-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store: "rs",
          user_id: userId,
          login: rsLogin,
          pass: rsPass,
        }),
      });

      if (response.ok) {
        toast.success("RS Store credentials saved successfully");
      } else {
        throw new Error("Failed to save credentials");
      }
    } catch (error) {
      toast.error("Failed to save RS Store credentials");
    } finally {
      setRsLoading(false);
    }
  };

  const saveIproCredentials = async () => {
    if (!iproLogin || !iproPass) {
      toast.error("Please fill in all iPro Store fields");
      return;
    }

    setIproLoading(true);
    try {
      const response = await fetch("/settings/api/user-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store: "ipro",
          user_id: userId,
          login: iproLogin,
          pass: iproPass,
        }),
      });

      if (response.ok) {
        toast.success("iPro Store credentials saved successfully");
      } else {
        throw new Error("Failed to save credentials");
      }
    } catch (error) {
      toast.error("Failed to save iPro Store credentials");
    } finally {
      setIproLoading(false);
    }
  };

  const saveVseCredentials = async () => {
    if (!vseLogin || !vsePass) {
      toast.error("Please fill in all VSE Store fields");
      return;
    }

    setVseLoading(true);
    try {
      const response = await fetch("/settings/api/user-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store: "vse",
          user_id: userId,
          login: vseLogin,
          pass: vsePass,
        }),
      });

      if (response.ok) {
        toast.success("VSE Store phone number saved successfully");
      } else {
        throw new Error("Failed to save phone");
      }
    } catch (error) {
      toast.error("Failed to save VSE Store phone number");
    } finally {
      setVseLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background mt-10">
      <div className="mx-auto max-w-4xl p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-balance">
            Авторизационные данные
          </h1>
          <p className="text-muted-foreground text-pretty">
            Управляйте учётными данными аутентификации для подключённых
            магазинов
          </p>
        </div>

        <div className="space-y-6">
          {/* RS Store */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Store className="size-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Русский Свет</CardTitle>
                  <CardDescription>
                    Авторизационные данные для магазина Русский Свет
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isInitialLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="rs-login">Логин</Label>
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rs-pass">Пароль</Label>
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                  <div className="col-span-2">
                    <Skeleton className="h-10 w-full sm:w-32 rounded-md" />
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="rs-login">Логин</Label>
                    <Input
                      id="rs-login"
                      type="text"
                      placeholder="Введите логин"
                      value={rsLogin}
                      onChange={(e) => setRsLogin(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rs-pass">Пароль</Label>
                    <Input
                      id="rs-pass"
                      type="password"
                      placeholder="Введите пароль"
                      value={rsPass}
                      onChange={(e) => setRsPass(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Button
                      onClick={saveRsCredentials}
                      disabled={rsLoading}
                      className="w-full sm:w-auto"
                    >
                      {rsLoading && (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      )}
                      Сохранить
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* iPro Store */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-chart-2/20">
                  <Lock className="size-5 text-chart-2" />
                </div>
                <div>
                  <CardTitle>ЭТМ iPRO</CardTitle>
                  <CardDescription>
                    Авторизационные данные для магазина ЭТМ iPRO
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isInitialLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ipro-login">Логин</Label>
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ipro-pass">Пароль</Label>
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                  <div className="col-span-2">
                    <Skeleton className="h-10 w-full sm:w-32 rounded-md" />
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ipro-login">Логин</Label>
                    <Input
                      id="ipro-login"
                      type="text"
                      placeholder="Введите логин"
                      value={iproLogin}
                      onChange={(e) => setIproLogin(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ipro-pass">Пароль</Label>
                    <Input
                      id="ipro-pass"
                      type="password"
                      placeholder="Введите пароль"
                      value={iproPass}
                      onChange={(e) => setIproPass(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Button
                      onClick={saveIproCredentials}
                      disabled={iproLoading}
                      className="w-full sm:w-auto"
                    >
                      {iproLoading && (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      )}
                      Сохранить
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* VSE Store */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-10 items-center justify-center rounded-lg bg-chart-4/20">
                  <Phone className="size-5 text-chart-4" />
                </div>
                <div>
                  <CardTitle>ВсеИнструменты</CardTitle>
                  <CardDescription>
                    Авторизационные данные для магазина ВсеИнструменты
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isInitialLoading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vse-login">Логин</Label>
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vse-pass">Пароль</Label>
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                  <div className="col-span-2">
                    <Skeleton className="h-10 w-full sm:w-32 rounded-md" />
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vse-login">Логин</Label>
                    <Input
                      id="vse-login"
                      type="text"
                      placeholder="Введите логин"
                      value={vseLogin}
                      onChange={(e) => setVseLogin(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vse-pass">Пароль</Label>
                    <Input
                      id="vse-pass"
                      type="password"
                      placeholder="Введите пароль"
                      value={vsePass}
                      onChange={(e) => setVsePass(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <Button
                      onClick={saveVseCredentials}
                      disabled={vseLoading}
                      className="w-full sm:w-auto"
                    >
                      {vseLoading && (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      )}
                      Сохранить
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
