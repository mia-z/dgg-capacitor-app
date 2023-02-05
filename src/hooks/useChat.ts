import { useRef, useState, useEffect, useCallback, useLayoutEffect } from "react";
import { parseChatMessage } from "../lib/Helpers";
import {useBoundStore} from "./useBoundStore";

export const useChat = (auth: string) => {
    const wsClient = useRef<WebSocket | null>(null);

    const { addChatUser, addMessage, hideUserMessages, removeChatUser, setChatUsers } = useBoundStore();

    const [authKey, setAuthKey] = useState<string>(auth);

    const [ready, setReady] = useState<boolean>(false);

    useEffect(() => {
//		wsClient.current = new WebSocket("wss://linode.miaz.xyz/ws?authkey=" + authKey);
//		wsClient.current = new WebSocket("wss://linode.miaz.xyz/wslocal");
		wsClient.current = new WebSocket("ws://192.168.7.101:5125/wslocal");

        applyListeners();

        return () => {
            cleanupListeners();
            wsClient.current!.close();
        }
	}, [wsClient, authKey]);

    const applyListeners = useCallback(() => {
        if (wsClient.current !== null) {
            console.log("applying listeners");
            wsClient.current.addEventListener("message", handleMessage);
            wsClient.current.addEventListener("close", handleClose);
            wsClient.current.addEventListener("error", handleError);
            wsClient.current.addEventListener("open", handleOpen);
        }
	}, [wsClient]);

    const cleanupListeners = useCallback(() => {
        if (wsClient.current !== null) {
            console.log("cleaning listeners");
            wsClient.current.removeEventListener("message", handleMessage);
            wsClient.current.removeEventListener("close", handleClose);
            wsClient.current.removeEventListener("error", handleError);
            wsClient.current.removeEventListener("open", handleOpen);
        }
	}, [wsClient]);

    const handleMessage = useCallback((message: MessageEvent) => {
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
        }
	}, [wsClient]);

    const handleOpen = useCallback((event: Event) => {
        console.log("Connected to chat!");
        setReady(true);
	}, [wsClient]);

    const handleClose = useCallback((event: Event) => {
        console.log("Chat socket closed!");
		addMessage({ data: "Disconnected - will try to reconnect..", command: "SYS", isHidden: false, type: "warning", timestamp: Date.now().toString() });
        setReady(false);
	}, [wsClient]);

    const handleError = useCallback((error: Event) => {
        console.log("Chat socket error! " + error.type);
	}, [wsClient]);

    const sendMessage = useCallback((chatMessage: string) => {
		wsClient.current?.send(chatMessage);
    }, [wsClient]);

    return { sendMessage };
}