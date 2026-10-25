import { app } from "@/server/app.ts";

// Expo Router の API Route はこのファイルだけにし、/api 以下のリクエストをすべて Hono に渡す
const handler = (request: Request) => app.fetch(request);

export {
  handler as DELETE,
  handler as GET,
  handler as OPTIONS,
  handler as PATCH,
  handler as POST,
  handler as PUT,
};
