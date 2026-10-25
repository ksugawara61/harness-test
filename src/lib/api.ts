const MOCK = process.env.EXPO_PUBLIC_API_MOCK;
const BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8081";

// API への通信はすべてここを通す。
// EXPO_PUBLIC_API_MOCK=offline のときは、MSW のハンドラーでアプリの中で応答する。
// Service Worker や msw/node に頼らず fetch の手前で差し込むため、どの環境でも同じハンドラーが動く。
// 値はビルド時に埋め込まれ、モックを使わないビルドでは分岐ごと消える
export const apiFetch = async (
  path: string,
  init?: RequestInit,
): Promise<Response> => {
  const request = new Request(new URL(path, BASE), init);
  if (MOCK === "offline") {
    const [{ getResponse }, { handlers }] = await Promise.all([
      import("msw"),
      import("@/mocks/handlers.ts"),
    ]);
    const response = await getResponse(handlers, request);
    if (response) return response;
  }
  return fetch(request);
};
