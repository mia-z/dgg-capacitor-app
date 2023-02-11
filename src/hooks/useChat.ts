import { useRef, useState, useEffect, useCallback, useLayoutEffect } from "react";
import { parseChatMessage } from "../lib/Helpers";
import {useBoundStore} from "./useBoundStore";
import { CapacitorWebsocket, ConnectedEvent, DisconnectedEvent, ErrorEvent, MessageEvent } from "@miaz/capacitor-websocket";

export const useChat = (auth: string) => {
    const { addChatUser, addMessage, hideUserMessages, removeChatUser, setChatUsers, setPollIsActive, setNewPoll, endPoll, updatePoll } = useBoundStore();

    const [authKey, setAuthKey] = useState<string>(auth);

    const [ready, setReady] = useState<boolean>(false);

    useEffect(() => {
        applyListeners();
        CapacitorWebsocket.build({ 
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
        CapacitorWebsocket.applyListeners({ name: "chat" });
        CapacitorWebsocket.connect({ name: "chat" });

        return () => {
            cleanupListeners();
            CapacitorWebsocket.disconnect({ name: "chat" });
        }
	}, [authKey]);

    const applyListeners = useCallback(() => {
        CapacitorWebsocket.addListener<EventNames>("chat:message", handleMessage);
        CapacitorWebsocket.addListener<EventNames>("chat:disconnected", handleDisconnect);
        CapacitorWebsocket.addListener<EventNames>("chat:error", handleError);
        CapacitorWebsocket.addListener<EventNames>("chat:connected", handleConnect);
	}, []);

    const cleanupListeners = useCallback(() => {
        console.log("cleaning listeners");
        CapacitorWebsocket.removeAllListeners();
	}, []);

    const handleMessage = useCallback((message: MessageEvent) => {
        //console.log(message);
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
        }
	}, []);

    const handleConnect = useCallback((event: ConnectedEvent) => {
        console.log("Connected to chat!");
        setReady(true);
	}, []);

    const handleDisconnect = useCallback((event: DisconnectedEvent) => {
        console.log("Disconnected from chat!");
		addMessage({ data: "Disconnected - will try to reconnect..", command: "SYS", isHidden: false, type: "warning", timestamp: Date.now().toString() });
	}, []);

    const handleError = useCallback((error: ErrorEvent) => {
        console.log("Chat socket error! " + error.cause);
	}, []);

    const sendMessage = (chatMessage: string) => {
        CapacitorWebsocket.send({ name: "chat", data: `MSG { "data": "${chatMessage}" } ` });
    };

    return { sendMessage };
}