import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { fileUrl } = await request.json();

    const res = await fetch(
      "http://supabasekong-boo0w0g0k40k8kwsw4g0sc0o.217.114.187.98.sslip.io/storage/v1/object/price-results/" +
        fileUrl,
      {
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2MDkzNTMyMCwiZXhwIjo0OTE2NjA4OTIwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.LWWpCAMuV_jmGChKjELEcFIC3xkZ3fAifzugHFc7PxY",
        },
      },
    );

    const blob = await res.blob();

    if (!res.ok) {
      const errorText = await res.text();
      console.error("File download error:", errorText);
      return NextResponse.json(
        { error: errorText || "Download failed" },
        { status: 500 },
      );
    }

    // Return the blob with proper headers
    return new NextResponse(blob, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileUrl}"`,
      },
    });
  } catch (error) {
    console.error("[v0] Download route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
