import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";

import { BookingMcpServer } from "./mcp-server.js";

dotenv.config();

export async function runServer(): Promise<void> {
  const server = new BookingMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runServer().catch((error) => {
  console.error("Failed to run server:", error);
  process.exit(1);
});
