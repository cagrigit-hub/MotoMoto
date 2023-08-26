import WebSocket from "ws";
import envy from "../../config/env";

const socket = new WebSocket(
    envy.WS_URL
  );

export default socket;