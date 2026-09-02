import { NextResponse } from "next/server";
import { requireAuth } from "@/src/server/auth";
import { getUserStats } from "@/src/server/actions/stats";
import {
  createSuccessResponse,
  errorToResponse,
} from "@/src/server/create-response";

const GET = async () => {
  try {
    const session = await requireAuth();
    const data = getUserStats(session.user.id);
    return NextResponse.json(createSuccessResponse({ data }), { status: 200 });
  } catch (error) {
    return errorToResponse(error);
  }
};

export { GET };
