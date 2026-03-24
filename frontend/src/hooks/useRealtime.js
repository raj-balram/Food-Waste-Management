import { useEffect } from "react";
import { useSocket } from "../context/SocketContext";

/**
 * Call this hook inside any component that should auto-refresh on socket events.
 * @param {Function} refreshFn - the function to call when a relevant event fires
 * @param {string[]} events - list of socket event names to listen to
 */
const useRealtime = (refreshFn, events = []) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket || events.length === 0) return;

    events.forEach((event) => {
      socket.on(event, () => {
        refreshFn(); // auto-refresh whenever this event fires
      });
    });

    return () => {
      events.forEach((event) => socket.off(event));
    };
  }, [socket, refreshFn]);
};

export default useRealtime;