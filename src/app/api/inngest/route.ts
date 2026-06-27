import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest-client";
import { processPdfExport, processDocxExport } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processPdfExport,
    processDocxExport,
  ],
});
