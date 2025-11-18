import { deletePriceRequestById } from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idStr = searchParams.get("id");

    if (!idStr || isNaN(Number(idStr))) {
      return NextResponse.json(
        { error: "Missing or invalid 'id' query parameter" },
        { status: 400 },
      );
    }

    const id = Number(idStr);

    const result = await deletePriceRequestById({ id });

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Не удалось удалить запрос",
      },
      { status: 500 },
    );
  }
}
