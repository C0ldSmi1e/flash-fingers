import { NextRequest, NextResponse, after } from "next/server";
import { getRandomContent } from "@/src/server/actions/content";
import { topUpContent } from "@/src/server/actions/generate-content";
import { contentQuerySchema } from "@/src/schemas/content";
import { BadRequestError } from "@/src/server/errors";
import {
  createSuccessResponse,
  errorToResponse,
} from "@/src/server/create-response";

const GET = async (request: NextRequest) => {
  try {
    const query = contentQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    if (!query.success) {
      throw new BadRequestError(query.error.issues[0].message);
    }

    // Scheduled before the read so an empty pool still triggers a top-up.
    after(async () => {
      try {
        await topUpContent();
      } catch (error) {
        console.error("[content] top-up failed", error);
      }
    });

    const data = getRandomContent({ limit: query.data.limit });
    return NextResponse.json(createSuccessResponse({ data }), { status: 200 });
  } catch (error) {
    return errorToResponse(error);
  }
};

export { GET };
