import { useEffect } from 'react';
import { eventHandler } from 'dbl-utils';

type EventMap = Record<string, [string, (...args: any[]) => void]>;
export default function useEventHandler(events: EventMap, id?: string): void {
  const eventNames = Object.values(events).map(([name]) => name).join('.');
  useEffect(() => {
    Object.values(events).forEach(([evtName, evtCallback]) => {
      eventHandler.subscribe(evtName, evtCallback, id ?? '');
    });
    return () => {
      Object.values(events).forEach(([evtName]) => {
        eventHandler.unsubscribe(evtName, id ?? '');
      });
    };
  }, [eventNames, id]);
}
