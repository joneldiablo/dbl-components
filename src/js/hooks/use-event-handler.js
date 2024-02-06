import { useEffect } from "react";

import eventHandler from "../functions/event-handler";

export default function useEventHandler(events, id, timeoutReady = 300) {
  const [name, jsClass] = id;
  let timeoutIdReady;
  useLayoutEffect(() => {
    clearTimeout(timeoutIdReady);
    timeoutIdReady = setTimeout(() => {
      eventHandler.dispatch('ready.' + name);
    }, timeoutReady);
    return () => clearTimeout(timeoutIdReady);
  });
  return useEffect(() => {

    Object.values(events).forEach(([evtName, evtCallback]) => {
      eventHandler.subscribe(evtName, evtCallback, id.join('-'));
    });

    return () => {
      Object.values(events).forEach(([evtName]) => {
        eventHandler.unsubscribe(evtName, id.join('-'));
      });
    }
  }, []);
}