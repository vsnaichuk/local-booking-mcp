import { z } from "zod";
import { makeRequest, parseUserId } from "../common/utils.js";
import { BASE_URL } from "../common/constants.js";
import { formatDate } from "../common/date.js";

export const DeskBookingOptions = z.object({
  deskId: z.number().int(),
  bookingStartTime: z.string().transform(formatDate),
  bookingEndTime: z.string().transform(formatDate),
});

export const DeskBookingChangeOptions = z.object({
  deskRequestId: z.number().int(),
  deskId: z.number().int(),
  dates: z.array(z.string().datetime()),
});

export const DeskBookingOptionsSchema = DeskBookingOptions;
export const DeskBookingChangeOptionsSchema = DeskBookingChangeOptions;

export async function createDeskBooking(
  options: z.infer<typeof DeskBookingOptions>
) {
  const userId = parseUserId(process.env.PERSONAL_ACCESS_TOKEN);
  return makeRequest(`${BASE_URL}/reservation/booking`, {
    method: "POST",
    body: { userId, ...options },
  });
}

export async function editDeskBooking(
  options: z.infer<typeof DeskBookingChangeOptions>
) {
  return makeRequest(`${BASE_URL}/reservation/edit`, {
    method: "PUT",
    body: options,
  });
}
