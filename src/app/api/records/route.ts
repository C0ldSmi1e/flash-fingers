import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/src/server/auth";
import { createRecord } from "@/src/server/actions/records";
import { createRecordSchema } from "@/src/schemas/record";
import { BadRequestError } from "@/src/server/errors";
import {
  createSuccessResponse,
  errorToResponse,
} from "@/src/server/create-response";

const POST = async (request: NextRequest) => {
  try {
    const session = await requireAuth();

    const body = createRecordSchema.safeParse(await request.json());
    if (!body.success) {
      throw new BadRequestError(body.error.issues[0].message);
    }

    const data = createRecord(session.user.id, body.data);
    return NextResponse.json(createSuccessResponse({ data }), { status: 201 });
  } catch (error) {
    return errorToResponse(error);
  }
};

export { POST };
