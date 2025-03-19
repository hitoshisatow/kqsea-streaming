import WebSocketServer from 'ws';

import { default as OBSWebSocket } from 'obs-websocket-js';
import { InstantReplayHandler } from './hivemind-event-handlers/instant-replay-handler.js';
import { readFileSync } from 'fs';

type OBS_Config = {
    password: string;
}

export type Event = {
    gameID: string
    eventID: string
    time: string
    type: string,
    values: string[]
}

export interface HivemindEventHandler {
    handle(event: Event): void;
}

export const handlers = [
    new InstantReplayHandler()
];

export const obs = new OBSWebSocket();

const connectToObs = async () => {
    let password: string | undefined = undefined;

    const obj: OBS_Config = JSON.parse(readFileSync('configs/kqsea-streaming/obs-config.json', 'utf8'));
    password = obj.password;

    await obs.connect('ws://127.0.0.1:4455', password);
}

const createEventHandlerServer = () => {
    const wss = new WebSocketServer.Server({ port: 8123 });

    wss.on("connection", ws => {
        console.log("HiveMind client connected to KQ Control");

        ws.on("message", data => {
            const jsonData: Event = JSON.parse(data.toString());
            handlers.forEach(handler => handler.handle(jsonData));
            ws.send(JSON.stringify({ eventID: jsonData.eventID }));
        });

        ws.on("close", () => {
            console.log("The HiveMind client has disconnected");
        });

        ws.onerror = () => {
            console.log("Some Error occurred");
        }
    });
    console.log("KQ Control WebSocket server for HiveMind client is running on port 8123");
}

connectToObs();
createEventHandlerServer();
