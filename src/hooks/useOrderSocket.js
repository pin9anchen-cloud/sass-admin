// 订阅商家订单的实时推送；组件卸载时自动关闭连接，避免连接泄漏
import { useEffect, useRef, useState } from "react";
import { getTenantId } from "../utils/auth";

function useOrderSocket(onMessage) {
  const [connected, setConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    const tenantId = getTenantId();
    const ws = new WebSocket(`ws://localhost:8080/ws/order/${tenantId}`);
    ws.onopen = () => setConnected(true);
    ws.onmessage = (event) => onMessageRef.current(event);
    ws.onclose = () => setConnected(false);
    return () => ws.close();
  }, []);

  return connected;
}

export default useOrderSocket;
