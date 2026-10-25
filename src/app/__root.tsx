import { createRootRoute, Outlet } from "@tanstack/react-router";

// 画面に共通のレイアウトは持たないため、子のルートをそのまま描画する
export const Route = createRootRoute({ component: Outlet });
