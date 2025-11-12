import { useEffect } from 'react';
import { eventHandler } from 'dbl-utils';

type EventMap = Record<string, [string, (...args: any[]) => void]>;
export default function useEventHandler(events: EventMap, id?: string): void {
  const eventNames = Object.values(events).map(([name]) => name).join('.');
  useEffect(() => {
    Object.values(events).forEach(([evtName, evtCallback]) => {
      if (id) eventHandler.subscribe(evtName, evtCallback, id);
      else eventHandler.subscribe(evtName, evtCallback);
    });
    return () => {
      Object.values(events).forEach(([evtName]) => {
        if (id) eventHandler.unsubscribe(evtName, id);
        else eventHandler.unsubscribe(evtName);
      });
    };
  }, [eventNames, id]);
}
