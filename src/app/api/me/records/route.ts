import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/src/server/auth";
import { getUserRecords } from "@/src/server/actions/records";
import { paginationQuerySchema } from "@/src/schemas/standard-response";
import { pagination } from "@/src/config/constants";
import { BadRequestError } from "@/src/server/errors";
import {
  createSuccessResponse,
  errorToResponse,
} from "@/src/server/create-response";

const GET = async (request: NextRequest) => {
  try {
    const session = await requireAuth();

    const query = paginationQuerySchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    if (!query.success) {
      throw new BadRequestError(query.error.issues[0].message);
    }

    const paginated =
      query.data.offset !== undefined || query.data.limit !== undefined;
    const offset = query.data.offset ?? pagination.defaultOffset;
    const limit =
      query.data.limit ??
      (paginated ? pagination.defaultLimit : pagination.maxLimit);

    const { data, total } = getUserRecords(session.user.id, { limit, offset });
    return NextResponse.json(
      createSuccessResponse({
        data,
        pagination: paginated
          ? { offset, limit, total, hasMore: offset + data.length < total }
          : null,
      }),
      { status: 200 },
    );
  } catch (error) {
    return errorToResponse(error);
  }
};

export { GET };
