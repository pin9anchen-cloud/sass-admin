// 订阅商家订单的实时推送；断线自动重连（指数退避），组件卸载时关闭连接并停止重连
import { useEffect, useRef, useState } from "react";
import { getTenantId } from "../utils/auth";
import { WS_BASE_URL } from "../utils/request";

const INITIAL_RETRY_DELAY = 1000; // 1s
const MAX_RETRY_DELAY = 30000; // 30s

function useOrderSocket(onMessage) {
  const [connected, setConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    let stopped = false;
    let ws = null;
    let retryTimer = null;
    let retryDelay = INITIAL_RETRY_DELAY;

    const connect = () => {
      const tenantId = getTenantId();
      ws = new WebSocket(`${WS_BASE_URL}/ws/order/${tenantId}`);

      ws.onopen = () => {
        setConnected(true);
        retryDelay = INITIAL_RETRY_DELAY; // 连上了就重置退避时间
      };
      ws.onmessage = (event) => onMessageRef.current(event);
      ws.onclose = () => {
        setConnected(false);
        if (stopped) return;
        retryTimer = setTimeout(connect, retryDelay);
        retryDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY);
      };
    };

    connect();

    return () => {
      stopped = true;
      clearTimeout(retryTimer);
      ws.close();
    };
  }, []);

  return connected;
}

export default useOrderSocket;
