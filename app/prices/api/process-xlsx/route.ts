import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData();

    // Forward the request to your server
    const response = await fetch(process.env.PRICES_API_URL!, {
      method: "POST",
      body: formData,
    });

    // Check if the response is OK
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to process XLSX file", status: response.status },
        { status: response.status },
      );
    }

    // Parse the response data
    const data = await response.json();

    // Return the data from your server
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[v0] Error processing XLSX:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
