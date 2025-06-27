import { Server as McpServer } from "@modelcontextprotocol/sdk/server/index.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import * as greetOp from "./operations/greet.js";
import * as roomFilter from "./operations/room-filter.js";
import * as roomPlan from "./operations/room-plan.js";
import * as deskBooking from "./operations/desk-booking.js";
import * as deskRequest from "./operations/desk-request.js";

export const Logger = {
  info: (...args: any[]) => {},
  error: (...args: any[]) => {},
};

export class BookingMcpServer {
  private readonly server: McpServer;

  constructor() {
    this.server = new McpServer(
      {
        name: "booking-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          logging: {},
          tools: {},
        },
      }
    );
    this.registerTools();
  }

  private registerTools(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "greet",
            description: "Tool for testing purposes",
            inputSchema: zodToJsonSchema(greetOp.GreetOptionsSchema),
          },
          {
            name: "select_office_location",
            description:
              "Info about office locations, including their availability of rooms and the types of rooms present",
            inputSchema: zodToJsonSchema(roomFilter.LocationListOptionsSchema),
          },
          {
            name: "select_room",
            description: "Rooms List of a specific location",
            inputSchema: zodToJsonSchema(roomFilter.RoomListOptionsSchema),
          },
          {
            name: "select_desk",
            description:
              "Use this to display text visualization of desks in a room and their availability",
            inputSchema: zodToJsonSchema(roomPlan.RoomPlanOptionsSchema),
          },
          {
            name: "create_desk_booking",
            description: "Create a desk booking",
            inputSchema: zodToJsonSchema(deskBooking.DeskBookingOptionsSchema),
          },
          {
            name: "edit_desk_booking",
            description: "Edit a desk booking",
            inputSchema: zodToJsonSchema(
              deskBooking.DeskBookingChangeOptionsSchema
            ),
          },
          {
            name: "cancel_desk_request",
            description: "Cancel a desk request",
            inputSchema: zodToJsonSchema(deskRequest.CancelDeskOptionsSchema),
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (req) => {
      try {
        const toolName = req.params.name;
        const toolArgs = req.params.arguments;

        if (!toolArgs) {
          throw new Error("Arguments are required");
        }

        switch (toolName) {
          case "greet": {
            const args = greetOp.GreetOptionsSchema.parse(toolArgs);
            const res = await greetOp.greet(args);
            return {
              content: [{ type: "text", text: res }],
            };
          }

          case "select_office_location": {
            const args = roomFilter.LocationListOptionsSchema.parse(toolArgs);
            const res = await roomFilter.getLocationsInfo(args);
            return {
              content: [{ type: "text", text: JSON.stringify(res, null, 2) }],
            };
          }
          case "select_room": {
            const args = roomFilter.RoomListOptionsSchema.parse(toolArgs);
            const res = await roomFilter.getRoomList(args);
            return {
              content: [{ type: "text", text: JSON.stringify(res, null, 2) }],
            };
          }
          case "select_desk": {
            const args = roomPlan.RoomPlanOptionsSchema.parse(toolArgs);
            const desksVisualization = await roomPlan.getRoomPlanByRoomId(args);
            const text = "Show this to user:```\n" + desksVisualization + "```";
            return {
              content: [{ type: "text", text }],
            };
          }
          case "create_desk_booking": {
            const args = deskBooking.DeskBookingOptionsSchema.parse(toolArgs);
            const res = await deskBooking.createDeskBooking(args);
            return {
              content: [{ type: "text", text: JSON.stringify(res, null, 2) }],
            };
          }
          case "edit_desk_booking": {
            const args =
              deskBooking.DeskBookingChangeOptionsSchema.parse(toolArgs);
            const res = await deskBooking.editDeskBooking(args);
            return {
              content: [{ type: "text", text: JSON.stringify(res, null, 2) }],
            };
          }
          case "cancel_desk": {
            const args = deskRequest.CancelDeskOptionsSchema.parse(toolArgs);
            const res = await deskRequest.cancelDesk(args);
            return {
              content: [{ type: "text", text: JSON.stringify(res, null, 2) }],
            };
          }
          // Add more tools here as needed

          default:
            throw new Error(`Unknown tool: ${toolName}`);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          Logger.error("Zod validation error:", error);
          throw new Error(`Invalid input: ${JSON.stringify(error.errors)}`);
        }
        Logger.error(error);
        throw error;
      }
    });
  }

  async connect(transport: Transport): Promise<void> {
    Logger.info("Connecting to transport...");
    await this.server.connect(transport);

    Logger.info = (...args: any[]) => {
      this.server.sendLoggingMessage({
        level: "info",
        data: args,
      });
    };
    Logger.error = (...args: any[]) => {
      this.server.sendLoggingMessage({
        level: "error",
        data: args,
      });
    };

    Logger.info("Server connected and ready to process requests");
  }
}
