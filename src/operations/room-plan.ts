import { z } from "zod";
import { buildUrl, makeRequest } from "../common/utils.js";
import { BASE_URL } from "../common/constants.js";
import { formatDate } from "../common/date.js";
import { transformRoomPlanResponse } from "../transformers/room-plan.js";

export const RoomPlanOptions = z.object({
  roomId: z.number().int(),
  dateFrom: z.string().transform(formatDate),
  dateTo: z.string().transform(formatDate),
});
export const RoomPlanOptionsSchema = RoomPlanOptions;

export async function getRoomPlanByRoomId(
  params: z.infer<typeof RoomPlanOptions>
) {
  const svg = await makeRequest(buildUrl(`${BASE_URL}/plans/current`, params));
  return transformRoomPlanResponse(svg as string);
}
