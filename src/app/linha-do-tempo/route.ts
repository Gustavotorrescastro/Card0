import { NextResponse } from "next/server";

function calculateAccumulatedImpact(startDate: Date) {
  const now = new Date();
  const diffInMs = now.getTime() - startDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  const impactPerDayKgCO2 = 0.5;
  const totalImpact = diffInDays * impactPerDayKgCO2;

  return {
    days: diffInDays,
    totalKgCO2: totalImpact,
    message: `Desde ${startDate.toLocaleDateString()}, você já evitou ${totalImpact.toFixed(2)} kg de CO2.`,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const startDateParam = searchParams.get("startDate");

  if (!userId || !startDateParam) {
    return NextResponse.json(
      { error: "Parâmetros obrigatórios: userId e startDate" },
      { status: 400 }
    );
  }

  const startDate = new Date(startDateParam);
  const impact = calculateAccumulatedImpact(startDate);

  return NextResponse.json({
    userId,
    startDate,
    accumulatedImpact: impact,
  });
}
