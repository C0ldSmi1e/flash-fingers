import { NextRequest, NextResponse } from "next/server";
import { getRank } from "@/src/server/actions/stats";
import { rankQuerySchema } from "@/src/schemas/stats";
import { BadRequestError } from "@/src/server/errors";
import {
  createSuccessResponse,
  errorToResponse,
} from "@/src/server/create-response";

const GET = async (request: NextRequest) => {
  try {
    const query = rankQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    if (!query.success) {
      throw new BadRequestError(query.error.issues[0].message);
    }

    const data = getRank(query.data);
    return NextResponse.json(createSuccessResponse({ data }), { status: 200 });
  } catch (error) {
    return errorToResponse(error);
  }
};

export { GET };
