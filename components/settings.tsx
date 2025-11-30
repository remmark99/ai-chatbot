"use client";

import { useState } from "react";
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

interface Props {
  session: Session;
}

export default function Settings({ session }: Props) {
  const userId = session.user.id;

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

  const saveRsCredentials = async () => {
    if (!rsLogin || !rsPass) {
      toast.error("Please fill in all RS Store fields");
      return;
    }

    setRsLoading(true);
    try {
      const response = await fetch(
        `http://146.103.103.157:8001/user-data/rs?user_id=${userId}&rs_login=${encodeURIComponent(rsLogin)}&rs_pass=${encodeURIComponent(rsPass)}`,
        { method: "POST" },
      );

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
      const response = await fetch(
        `http://146.103.103.157:8001/user-data/ipro?user_id=${userId}&ipro_login=${encodeURIComponent(iproLogin)}&ipro_pass=${encodeURIComponent(iproPass)}`,
        { method: "POST" },
      );

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
      const response = await fetch(
        `http://146.103.103.157:8001/user-data/vse-creds?user_id=${userId}&vse_login=${encodeURIComponent(vseLogin)}&vse_pass=${encodeURIComponent(vsePass)}`,
        { method: "POST" },
      );

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
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-balance">
            Store Credentials
          </h1>
          <p className="text-muted-foreground text-pretty">
            Manage authentication credentials for your connected stores
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
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rs-login">Логин</Label>
                  <Input
                    id="rs-login"
                    type="text"
                    placeholder="Enter RS login"
                    value={rsLogin}
                    onChange={(e) => setRsLogin(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rs-pass">Пароль</Label>
                  <Input
                    id="rs-pass"
                    type="password"
                    placeholder="Enter RS password"
                    value={rsPass}
                    onChange={(e) => setRsPass(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={saveRsCredentials}
                disabled={rsLoading}
                className="w-full sm:w-auto"
              >
                {rsLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Сохранить
              </Button>
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
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ipro-login">Логин</Label>
                  <Input
                    id="ipro-login"
                    type="text"
                    placeholder="Enter iPro login"
                    value={iproLogin}
                    onChange={(e) => setIproLogin(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ipro-pass">Пароль</Label>
                  <Input
                    id="ipro-pass"
                    type="password"
                    placeholder="Enter iPro password"
                    value={iproPass}
                    onChange={(e) => setIproPass(e.target.value)}
                  />
                </div>
              </div>
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
                  <CardTitle>VSE Store</CardTitle>
                  <CardDescription>
                    Phone authentication for VSE Store access
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ipro-login">Логин</Label>
                  <Input
                    id="vse-login"
                    type="text"
                    placeholder="Enter VSE login"
                    value={vseLogin}
                    onChange={(e) => setVseLogin(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ipro-pass">Пароль</Label>
                  <Input
                    id="vse-pass"
                    type="password"
                    placeholder="Enter VSE password"
                    value={vsePass}
                    onChange={(e) => setVsePass(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={saveVseCredentials}
                disabled={vseLoading}
                className="w-full sm:w-auto"
              >
                {vseLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Сохранить
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
