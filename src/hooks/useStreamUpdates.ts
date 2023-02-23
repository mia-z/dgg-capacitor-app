import React, { useState, useEffect, useCallback } from "react";
import { useBoundStore } from "./useBoundStore";
import { CapacitorWebsocket, ConnectedEvent, DisconnectedEvent, ErrorEvent, MessageEvent } from "@miaz/capacitor-websocket";
import { parseLiveUpdateMessage } from "../lib/Helpers";
import { PluginListenerHandle } from "@capacitor/core";

export const useStreamUpdates = () => {
    const { setStreamInfo, setVideosInfo, setVodsInfo, setHostInfo } = useBoundStore();

    const [handlers, setHandlers] = useState<PluginListenerHandle[]>([]);
    const [connected, setConnected] = useState<boolean>(false);
    const [hasDisconnected, setHasDisconnected] = useState<boolean>(false);

    const applyListeners = useCallback(async () => {
        const handlers = await Promise.all([
            CapacitorWebsocket.addListener("live:message", handleMessage),
            CapacitorWebsocket.addListener("live:disconnected", handleDisconnect),
            CapacitorWebsocket.addListener("live:error", handleError),
            CapacitorWebsocket.addListener("live:connected", handleConnect)
        ]);
        
        setHandlers(handlers);
	}, []);

    const cleanupListeners = useCallback(async () => {
        if (handlers.length > 0) {
            await Promise.all(handlers.map(x => x.remove()));
        }
	}, [handlers]);

    const disconnect = useCallback(async () => {
        await CapacitorWebsocket.disconnect({ name: "live" });
    }, []);

    const handleMessage = useCallback((message: MessageEvent) => {
        const parsedMessage = parseLiveUpdateMessage(message.data);
        switch (parsedMessage?.type) {
            case "dggApi:hosting": {
                setHostInfo(parsedMessage.data);
            } break;
            case "dggApi:streamInfo":{
                setStreamInfo(parsedMessage.data);
            } break;
            case "dggApi:videos":{
                setVideosInfo(parsedMessage.data);
            } break;
            // case "dggApi:youtubeVods":{
            //     setVodsInfo(parsedMessage.data);
            // } break;
            default: return null; //Shouldnt ever hit this !
        }
	}, []);

    const handleConnect = useCallback((event: ConnectedEvent) => {
        console.log("connected to live updates");
	}, []);

    const handleDisconnect = useCallback((event: DisconnectedEvent) => {
        setHasDisconnected(true);
        console.log("disconnected from live updates");
	}, []);

    const handleError = useCallback((error: ErrorEvent) => {
        setHasDisconnected(true);
        console.log("Chat socket error! " + error.cause);
	}, []);

    useEffect(() => {
        if (!connected) {
            (async () => {
                await applyListeners();
                await CapacitorWebsocket.build({ 
                    name: "live",
                    url: "wss://live.destiny.gg", 
                    headers: { 
                        "User-Agent": "Appstiny-LiveConnector",
                        "Origin": "https://www.destiny.gg",
                    } 
                });
                await CapacitorWebsocket.applyListeners({ name: "live" });
                await CapacitorWebsocket.connect({ name: "live" });
                setConnected(true);
            })();
        }
	}, [connected]);

    useEffect(() => {
        if (hasDisconnected && connected) {
            (async () => {
                await cleanupListeners();
                await disconnect();
                setConnected(false);
                setHasDisconnected(false);
            })();
        }
    }, [connected, hasDisconnected, cleanupListeners]);
}