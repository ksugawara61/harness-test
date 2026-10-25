import {
  ScrollViewStyleReset,
  useServerDocumentContext,
} from "expo-router/html";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// web の静的レンダリング（app.json の web.output: "static"）で、各ページの HTML の外枠になる。
// Expo が差し込む script・CSS（headNodes・bodyNodes）は、useServerDocumentContext から受け取って描画する
const Html = ({ children }: Props) => {
  const { bodyAttributes, bodyNodes, headNodes, htmlAttributes } =
    useServerDocumentContext();

  return (
    <html lang="ja" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <title>やること</title>
        <ScrollViewStyleReset />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
};

export default Html;
