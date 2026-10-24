import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const Alert = ({ children }: Props) => (
  <p className="alert" role="alert">
    {children}
  </p>
);
