import React, {FC, useCallback, useContext, useEffect, useRef, useState} from "react"
import ChatLine from "./ChatLine"
import { Keyboard } from "@capacitor/keyboard";
import {BroadcastLine} from "./BroadcastLine";
import {useBoundStore} from "../hooks/useBoundStore";
import { useQuery } from "react-query";
import { RecentChatQuery } from "../lib/Queries";
import { parseChatMessage } from "../lib/Helpers";
import { UtilityLine } from "./UtilityLine";

type ChatContainerProps = {
	height: number,
	width: number
}

export const ChatContainer: FC<ChatContainerProps> = ({ height, width }) => {
	const { chatMessages, setMessages, playerIsHidden } = useBoundStore();

	const chatContainer = useRef<HTMLDivElement | null>(null);
	const chatBottomRef = useRef<HTMLDivElement | null>(null);

    const [bottomIsVisible, setBottomIsVisible] = useState<boolean>(true);

    const [isInteracting, setIsInteracting] = useState<boolean>(false);

    const [chatHeight] = useState<number>(playerIsHidden ? height - (((9/16) * width)) : height);

	const recentChatQuery = useQuery({
		queryKey: ["chatHistory"],
		queryFn: async () => await RecentChatQuery(),
		refetchInterval: false,
		onSuccess: (data) => {
			console.log(data);
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
			const messagesWithSeparator = [ ...messages, spacerMessage ]	
			setMessages(messagesWithSeparator);
		}
	});

    useEffect(() => {
        if (isInteracting || !bottomIsVisible) {
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
	}, [chatBottomRef, isInteracting, bottomIsVisible]);

    useEffect(() => {
        if (!isInteracting && bottomIsVisible) {
            chatContainer.current!.scroll({
				top: chatContainer.current!.scrollHeight,
			});
        }
	}, [chatMessages, height, isInteracting, bottomIsVisible]);

    const onChatContainerStartTouch = () => {
        setIsInteracting(true);
    }

	const onChatContainerEndTouch = useCallback(() => {
        setIsInteracting(false);
	}, [chatContainer]);

    const restoreScroll = () => {
        chatContainer.current!.scroll({
			top: chatContainer.current!.scrollHeight,
		});
        setBottomIsVisible(true);
    }

	return (
		<>
			<div onTouchMove={onChatContainerStartTouch} onTouchEnd={() => onChatContainerEndTouch()} ref={chatContainer} className={"relative bg-black overflow-scroll transition-all leading-6"} style={{ height: chatHeight }}>
				{
					chatMessages.map((message, index) => {
	                    switch(message.command) {
	                        case "MSG": return <ChatLine key={`${message.timestamp}-${message.nick}`} {...message} />;
	                        case "BROADCAST": return <BroadcastLine key={`${message.timestamp}-broadcast`} data={message.data} />;
							case "UTILITY": return <UtilityLine key={`${message.timestamp}-utility`} {...message} />
	                    }})
				}
				<div ref={chatBottomRef} className={"h-[4px]"}>{/*hidden reference for chat scrolling*/}</div>
	        </div>
			<div className={"relative"}>
				<div onClick={() => restoreScroll()} className={`${!bottomIsVisible ? "h-10 opacity-100" : "h-0 opacity-0 pointer-events-none"} absolute bottom-0 left-0 -right-2 transition-all flex z-[99999] w-[calc(100%-2px)] bg-black rounded-t-xl border-t border-x border-t-blue-400 border-x-blue-400`}>
					<div className={"text-white roboto text-xl my-auto w-full text-center"}>
						Click to return to latest messages
                    </div>
	            </div>
	        </div>
		</>
    );
}