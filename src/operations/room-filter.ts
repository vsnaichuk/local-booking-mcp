import { z } from "zod";
import { makeRequest, buildUrl } from "../common/utils.js";
import { BASE_URL } from "../common/constants.js";
import { formatDate } from "../common/date.js";

export const LocationListOptions = z.object({});

export const RoomListOptions = z.object({
  OfficeId: z.number().int(),
  BookingStartTime: z.string().transform(formatDate),
  BookingEndTime: z.string().transform(formatDate),
  RoomType: z
    .number()
    .int()
    .optional()
    .describe("Gets or sets the type of room. Optional."),
});

export const LocationListOptionsSchema = LocationListOptions;
export const RoomListOptionsSchema = RoomListOptions;

export async function getLocationsInfo(
  params: z.infer<typeof LocationListOptions>
) {
  return makeRequest(
    buildUrl(`${BASE_URL}/room-filters/locations-info`, params)
  );
}

export async function getRoomList(params: z.infer<typeof RoomListOptions>) {
  return makeRequest(buildUrl(`${BASE_URL}/room-filters/rooms-info`, params));
}
