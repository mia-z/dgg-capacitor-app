import { useRef, useState, useEffect, useCallback, useLayoutEffect } from "react";
import { parseChatMessage } from "../lib/Helpers";
import {useBoundStore} from "./useBoundStore";
import { CapacitorWebsocket, ConnectedEvent, DisconnectedEvent, ErrorEvent, MessageEvent } from "@miaz/capacitor-websocket";
import { PluginListenerHandle } from "@capacitor/core";

export const useChat = (auth: string) => {
    const { addChatUser, addMessage, hideUserMessages, removeChatUser, setChatUsers, setPollIsActive, setNewPoll, endPoll, updatePoll, setPinnedMessage, chatReady, setChatReady } = useBoundStore();

    const [authKey] = useState<string>(auth);

    const [handlers, setHandlers] = useState<PluginListenerHandle[]>([]);
    const [connected, setConnected] = useState<boolean>(false);
    const [hasDisconnected, setHasDisconnected] = useState<boolean>(false);

    const applyListeners = useCallback(async () => {
        const handlers = await Promise.all([
            CapacitorWebsocket.addListener("chat:message", handleMessage),
            CapacitorWebsocket.addListener("chat:disconnected", handleDisconnect),
            CapacitorWebsocket.addListener("chat:error", handleError),
            CapacitorWebsocket.addListener("chat:connected", handleConnect)
        ]);
        
        setHandlers(handlers);
	}, []);

    const cleanupListeners = useCallback(async () => {
        if (handlers.length > 0) {
            await Promise.all(handlers.map(x => x.remove()));
        }
	}, [handlers]);

    const disconnect = useCallback(async () => {
        await CapacitorWebsocket.disconnect({ name: "chat" });
    }, []);

    const handleMessage = useCallback((message: MessageEvent) => {
        console.log(message);
        const parsedMessage = parseChatMessage(message.data);
        switch (parsedMessage.command) {
            case "MSG": {
                addMessage(parsedMessage);
                break;
            }
            case "JOIN": {
                addChatUser(parsedMessage);
                break;
            }
			case "QUIT": {
                removeChatUser(parsedMessage);
                break;
            }
			case "NAMES": {
                setChatUsers(parsedMessage.users);
                break;
            }
			case "BROADCAST": {
				const unique = { ...parsedMessage, timestamp: `${parsedMessage.timestamp}${Date.now().toString()}` };
				addMessage(unique);
				break;
            }
			case "MUTE":
			case "BAN": {
                hideUserMessages(parsedMessage.data);
                break;
            }
			case "ERR": {
				console.log("Got an error message from the stream: " + parsedMessage.description);
                break;
            }
            case "POLLSTART": {
                setPollIsActive(true);
                setNewPoll(parsedMessage);
                break;
            }
            case "POLLSTOP": {
                endPoll(parsedMessage);
                break;
            }
            case "VOTECAST": {
                updatePoll(parsedMessage.vote);
                break;
            }
            case "PIN": {
                setPinnedMessage(parsedMessage);
            }
        }
	}, []);

    const handleConnect = useCallback((event: ConnectedEvent) => {
        console.log("Connected to chat!");
        addMessage({ data: "Connected to chat", command: "SYS", isHidden: false, type: "info", timestamp: Date.now().toString() });
	}, []);

    const handleDisconnect = useCallback((event: DisconnectedEvent) => {
        setHasDisconnected(true);
        console.log("Disconnected from chat!");
		addMessage({ data: "Disconnected - will try to reconnect..", command: "SYS", isHidden: false, type: "warning", timestamp: Date.now().toString() });
	}, []);

    const handleError = useCallback((error: ErrorEvent) => {
        setHasDisconnected(true);
        console.log("Chat socket error! " + error.cause);
        addMessage({ data: "Fatal socket error - will try to reconnect", command: "SYS", isHidden: false, type: "error", timestamp: Date.now().toString() });
	}, []);

    const sendMessage = (chatMessage: string) => {
        CapacitorWebsocket.send({ name: "chat", data: `MSG { "data": "${chatMessage}" } ` });
    };

    useEffect(() => {
        if (!connected && chatReady) {
            (async () => {
                await applyListeners();
                await CapacitorWebsocket.build({ 
                    name: "chat",
                    url: "wss://chat.destiny.gg/ws", 
                    //url: "wss://chat.omniliberal.dev/ws", 
                    headers: { 
                        "User-Agent": "Appstiny-ChatConnector",
                        //"Origin": "https://www.omniliberal.dev",
                        "Origin": "https://www.destiny.gg",
                        "Cookie": "authtoken=" + auth,
                    } 
                });
                addMessage({ data: "Connecting to chat..", command: "SYS", isHidden: false, type: "info", timestamp: Date.now().toString() });
                await CapacitorWebsocket.applyListeners({ name: "chat" });
                await CapacitorWebsocket.connect({ name: "chat" });
                setConnected(true);
            })();
        }
	}, [connected, authKey, chatReady]);

    useEffect(() => {
        if (hasDisconnected && connected && chatReady) {
            (async () => {
                await cleanupListeners();
                await disconnect();
                setConnected(false);
                setHasDisconnected(false);
            })();
        }
    }, [connected, hasDisconnected, cleanupListeners, authKey, chatReady]);

    return { sendMessage };
}