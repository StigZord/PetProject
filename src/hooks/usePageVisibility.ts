import { useCallback, useEffect, useState } from 'react';

const visibilityChangeEventName = 'visibilitychange';

const isDocumentVisible = () => {
  // Note: `document.hidden` is supported by latest browsers,
  // no need to check for msHidden / webkitHidden anymore.
  return document.hidden;
};

export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState<boolean>(isDocumentVisible());
  const onVisibilityChange = useCallback(
    () => setIsVisible(isDocumentVisible()),
    []
  );

  useEffect(() => {
    document.addEventListener(visibilityChangeEventName, onVisibilityChange);

    return () => {
      document.removeEventListener(
        visibilityChangeEventName,
        onVisibilityChange
      );
    };
  }, [onVisibilityChange]);

  return isVisible;
};
