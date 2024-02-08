import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(4),
  desctiption: z.string().optional(),
});

type formSchematype = z.infer<typeof formSchema>;
