import { useState } from "react";

export const useService = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return { handleDismiss, isDismissed };
};
