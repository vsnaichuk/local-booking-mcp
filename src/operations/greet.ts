import { z } from "zod";

export const GreetOptionsSchema = z.object({
  name: z.string(),
});

export type GreetOptions = z.infer<typeof GreetOptionsSchema>;

export async function greet(options: GreetOptions): Promise<string> {
  return `Hello, ${options.name}! The server is running in stdio mode.`;
}
