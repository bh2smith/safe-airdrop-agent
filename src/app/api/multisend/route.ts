import { defaultParser } from "multi-asset-transfer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  console.log("MultiSend Request", searchParams);
  const csv = searchParams.get("csv");
  // TODO: Validate CSV and allow fetch from URL.
  if (!csv) {
    return NextResponse.json({ error: "CSV is required" }, { status: 400 });
  }
  const chainId = searchParams.get("chainId");
  if (!chainId) {
    return NextResponse.json(
      { error: "Chain ID is required" },
      { status: 400 },
    );
  }
  const parser = defaultParser(Number(chainId));
  const [transfers, warnings] = await parser(csv);
  if (warnings.length > 0) {
    console.warn("Parser Warnings", warnings);
  }

  return NextResponse.json({ meta: { transfers, warnings } });
}
