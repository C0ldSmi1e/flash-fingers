import { NextRequest, NextResponse } from "next/server";
import { env } from "@/src/server/env";
import { topUpContent } from "@/src/server/actions/generate-content";
import { AuthorizationError } from "@/src/server/errors";
import {
  createSuccessResponse,
  errorToResponse,
} from "@/src/server/create-response";

const POST = async (request: NextRequest) => {
  try {
    if (request.headers.get("x-admin-secret") !== env.ADMIN_SECRET) {
      throw new AuthorizationError("Invalid admin secret");
    }

    const data = await topUpContent({ force: true });
    return NextResponse.json(createSuccessResponse({ data }), { status: 200 });
  } catch (error) {
    return errorToResponse(error);
  }
};

export { POST };
