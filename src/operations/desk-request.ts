import { z } from "zod";
import { BASE_URL } from "../common/constants.js";
import { buildUrl, makeRequest } from "../common/utils.js";

export const CancelDeskOptions = z.object({
  requestId: z.number().int().describe("The ID of the desk request to cancel"),
});

export const CancelDeskOptionsSchema = CancelDeskOptions;

export async function cancelDesk(params: z.infer<typeof CancelDeskOptions>) {
  return makeRequest(buildUrl(`${BASE_URL}/desk-requests/cancel`, params));
}
