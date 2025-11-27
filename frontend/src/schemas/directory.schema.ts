import { z } from "zod";

export const directorySchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character long"),
});

export type DirectoryData = z.infer<typeof directorySchema>;
