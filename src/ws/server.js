import { WebSocket, WebSocketServer } from "ws";
import {wsArcjet} from "../arcjet.js";
function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload) {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) return;
    client.send(JSON.stringify(payload));
  }
}


export function attachWebSocketServe(server){
    const wss=new WebSocketServer({server,path:"/ws",maxPayload:1024*1024});

    wss.on('connection',async (socket,req)=>{
        if(wsArcjet){
            try{
                const decision=await wsArcjet.protect(req);
                if(decision.isDenied()){
                    const code=decision.reason.isRateLimit()?1013:1008;
                    const reason=decision.reason.isRateLimit()?"Rate limit Exceeded":"Access Denied";
                    socket.close(code,reason)
                    return
                }
            }
            catch (error) {
                console.error("ws connection error",error);
                socket.close(1011,"server security Error");
            }
        }
        sendJson(socket,{type:"welcome"});

        socket.on('error',console.error)
    });

    function broadCastMatchCreated(match){
        broadcast(wss,{type:'match_created',data:match})
    }
    return {broadCastMatchCreated}
}