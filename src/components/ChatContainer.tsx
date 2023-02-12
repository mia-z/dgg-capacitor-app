import React, {FC, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react"
import ChatLine from "./ChatLine"
import { Keyboard } from "@capacitor/keyboard";
import {BroadcastLine} from "./BroadcastLine";
import {useBoundStore} from "../hooks/useBoundStore";
import { useQuery } from "react-query";
import { RecentChatQuery } from "../lib/Queries";
import { parseChatMessage } from "../lib/Helpers";
import { UtilityLine } from "./UtilityLine";
import { arrowDownOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { App } from "@capacitor/app";

type ChatContainerProps = {
	height: number,
	width: number
}

export const ChatContainer: FC<ChatContainerProps> = ({ height, width }) => {
	const { chatMessages, setMessages, playerIsHidden } = useBoundStore();

	const chatContainer = useRef<HTMLDivElement | null>(null);
	const chatBottomRef = useRef<HTMLDivElement | null>(null);

	const [shouldFetchChatAfterResume, setShouldFetchChatAfterResume] = useState<boolean>(true);

    const [bottomIsVisible, setBottomIsVisible] = useState<boolean>(true);

    const [isInteracting, setIsInteracting] = useState<boolean>(false);

    const [chatHeight] = useState<number>(playerIsHidden ? height - (((9/16) * width)) : height);

	const recentChatQuery = useQuery({
		queryKey: ["chatHistory"],
		queryFn: async () => await RecentChatQuery(),
		refetchInterval: false,
		enabled: shouldFetchChatAfterResume,
		onSuccess: (data) => {
			// console.log(data);
			const messages = data
				.map((payload) => parseChatMessage(payload))
				.filter((payload) => payload.command === "MSG" || payload.command === "BROADCAST") as MessageCollection; //Typescript couldnt grasp this inference hmm.
			const spacerMessage: UtilityMessage = {
				command: "UTILITY", 
				utilityType: "HORIZONTAL_SPACER", 
				data: "", 
				isHidden: false, 
				timestamp: Date.now().toString()
			};
			
			const messagesWithSeparator = [ ...messages, spacerMessage ];
			setMessages(messagesWithSeparator);
			setShouldFetchChatAfterResume(false);
			App.removeAllListeners();
		}
	});

	App.addListener("resume", () => {
		setShouldFetchChatAfterResume(true);
	});

	useEffect(() => {
		if (chatBottomRef.current) {
			const bottomObserver = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					setBottomIsVisible(true);
				} else {
					setBottomIsVisible(false);
				}
			})
			bottomObserver.observe(chatBottomRef.current!);
	
			return () => {
				bottomObserver.disconnect();
			}
		}
	}, [chatBottomRef])

    useEffect(() => {
        if (bottomIsVisible) {
            chatContainer.current!.scroll({
				top: chatContainer.current!.scrollHeight,
			});
        }
	}, [chatMessages, height, bottomIsVisible]);
	
    const restoreScroll = () => {
        chatContainer.current!.scroll({
			top: chatContainer.current!.scrollHeight,
		});
        setBottomIsVisible(true);
    }

	return (
		<>
			<div ref={chatContainer} className={"relative bg-black overflow-scroll transition-all leading-6"} style={{ height: chatHeight }}>
				{
					chatMessages.map((message, index) => {
						switch(message.command) {
							case "MSG": return <ChatLine key={`${message.timestamp}-${message.nick}`} {...message} />;
							case "BROADCAST": return <BroadcastLine key={`${message.timestamp}-broadcast`} data={message.data} />;
							case "UTILITY": return <UtilityLine key={`${message.timestamp}-utility`} {...message} />
					}})
				}
				<div ref={chatBottomRef} className={"h-[8px]"}>{/*hidden reference for chat scrolling*/}</div>
			</div>
			<div onClick={() => restoreScroll()} className={`transition-all z-50 absolute bottom-16 right-8 h-12 w-12 bg-blue-400 rounded-full flex ${!bottomIsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
				<IonIcon className={"text-white m-auto text-3xl"} icon={arrowDownOutline} />
			</div>
		</>
    );
}