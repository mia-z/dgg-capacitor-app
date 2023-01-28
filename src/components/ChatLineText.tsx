import React, { FC, TouchEvent, useState } from "react"
import { useBoundStore } from "../hooks/useBoundStore";
import {ChatLinkModal} from "./modals/VodsModal";

type ChatLineTextProps = {
    text: string,
	isGreenText: boolean,
	isSlashMeMessage: boolean,
	isCurrentUserMessage: boolean,
	onMessageTextPress: (text: string) => void,
}

const urlRegex = new RegExp("(http|https):\/\/(\S*)");

export const ChatLineText: FC<ChatLineTextProps> = ({ isGreenText, text, isSlashMeMessage, isCurrentUserMessage, onMessageTextPress }) => {
	const isAUrl = text.match(urlRegex);

	const [chatLinkModalIsOpen, setChatLinkModalIsOpen] = useState<boolean>(false);

	const onTextPress = (event: TouchEvent<HTMLDivElement>) => {
		event.stopPropagation();
		onMessageTextPress(text);
	}

	const onChatLinkPress = (event: TouchEvent<HTMLAnchorElement>) => {
		event.stopPropagation();
		setChatLinkModalIsOpen(true);
	}

	if (isAUrl) {
		return (
			<>
				<a href={text} className={`break-all text-[#02c2ff]`}>&nbsp;{text}</a>
				{/* <ChatLinkModal chatLinkModalIsOpen={chatLinkModalIsOpen} setChatLinkModalIsOpen={setChatLinkModalIsOpen} link={text} /> */}
			</>
		)
    } else return (
		<span onTouchEnd={onTextPress} className={`${isGreenText ? "text-[#6ca528]" : isCurrentUserMessage ? "text-[#dedede]" : "text-[#b9b9b9]"} ${isSlashMeMessage ? "italic" : ""} break-all`}>&nbsp;{text}</span>
	)
}
