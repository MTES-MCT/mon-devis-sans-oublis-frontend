import { log } from "@/lib/logger";

export async function GET() {
  const memory = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
  const uptime = Math.round(process.uptime() / 60);

  const status = memory > 400 ? "warning" : "ok";
  const healthData = {
    memory_mb: memory,
    uptime_min: uptime,
    status,
    environment: process.env.NODE_ENV,
  };

  log.always("HEALTH_CHECK", healthData);

  return Response.json({
    ...healthData,
    timestamp: new Date().toISOString(),
  });
}
