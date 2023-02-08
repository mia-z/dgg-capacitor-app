import { useRef, useState, useEffect, useCallback, useLayoutEffect } from "react";
import { parseChatMessage } from "../lib/Helpers";
import {useBoundStore} from "./useBoundStore";
import { DggChatSocket, ConnectedEvent, DisconnectedEvent, ErrorEvent, MessageEvent } from "@miaz/dgg-chat";

export const useChat = (auth: string) => {
    const { addChatUser, addMessage, hideUserMessages, removeChatUser, setChatUsers } = useBoundStore();

    const [authKey, setAuthKey] = useState<string>(auth);

    const [ready, setReady] = useState<boolean>(false);

    useEffect(() => {
        applyListeners();
        DggChatSocket.build({ authToken: auth });
        DggChatSocket.applyListeners();
        DggChatSocket.connect();

        return () => {
            cleanupListeners();
            DggChatSocket.disconnect();
        }
	}, [authKey]);

    const applyListeners = useCallback(() => {
        DggChatSocket.addListener("message", handleMessage);
        DggChatSocket.addListener("disconnected", handleDisconnect);
        DggChatSocket.addListener("error", handleError);
        DggChatSocket.addListener("connected", handleConnect);
	}, []);

    const cleanupListeners = useCallback(() => {
        console.log("cleaning listeners");
        //@ts-ignore
        DggChatSocket.removeAllListeners();
	}, []);

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
        DggChatSocket.send({ data: `MSG { "data": "${chatMessage}" } ` });
    };

    return { sendMessage };
}