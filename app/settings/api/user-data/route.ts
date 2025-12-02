import { auth } from "@/app/(auth)/auth";
import { getUserSettings } from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";

const RS_URL = "http://146.103.103.157:8080/user-data/rs";
const IPRO_URL = "http://146.103.103.157:8080/user-data/ipro";
const VSE_URL = "http://146.103.103.157:8080/user-data/vse-creds";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    const data = await getUserSettings(session.user.id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const { pathname, searchParams } = new URL(req.url);
  // Allow client to specify store in POST body
  const { store, user_id, login, pass } = await req.json();

  let upstreamUrl = "";
  let urlSearchParams = new URLSearchParams();

  if (store === "rs") {
    upstreamUrl = RS_URL;
    urlSearchParams.append("user_id", user_id);
    urlSearchParams.append("rs_login", login);
    urlSearchParams.append("rs_pass", pass);
  } else if (store === "ipro") {
    upstreamUrl = IPRO_URL;
    urlSearchParams.append("user_id", user_id);
    urlSearchParams.append("ipro_login", login);
    urlSearchParams.append("ipro_pass", pass);
  } else if (store === "vse") {
    upstreamUrl = VSE_URL;
    urlSearchParams.append("user_id", user_id);
    urlSearchParams.append("vse_login", login);
    urlSearchParams.append("vse_pass", pass);
  } else {
    return NextResponse.json({ error: "Unknown store" }, { status: 400 });
  }

  const fetchUrl = `${upstreamUrl}?${urlSearchParams.toString()}`;

  try {
    const upstreamResponse = await fetch(fetchUrl, { method: "POST" });
    if (upstreamResponse.ok) {
      // Forward any result text if needed
      return NextResponse.json({ success: true });
    } else {
      const error = await upstreamResponse.text();
      return NextResponse.json(
        { error: error || "Failed at upstream" },
        { status: 500 },
      );
    }
  } catch (e) {
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}
