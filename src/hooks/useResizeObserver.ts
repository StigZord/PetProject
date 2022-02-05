import { RefObject, useEffect, useRef, useState } from 'react';
import { ORDER_ITEM_HEIGHT } from '../components/orderBook/utils/orderBook.constants';

export const useResizeObserver = (containerRef: RefObject<HTMLDivElement>) => {
  const [maxItemsToRender, setMaxItemsToRender] = useState(10);

  const resizeObserver = useRef(
    new ResizeObserver((entries) => {
      if (entries && entries[0]) {
        const maxItemsToRender = Math.floor(
          entries[0].contentRect.height / ORDER_ITEM_HEIGHT
        );
        setMaxItemsToRender(maxItemsToRender);
      }
    })
  );

  useEffect(() => {
    const calmDownTypeScript = resizeObserver.current;
    if (containerRef.current) {
      calmDownTypeScript.observe(containerRef.current);
    }

    return () => {
      calmDownTypeScript.disconnect();
    };
  }, [containerRef]);

  return maxItemsToRender;
};
