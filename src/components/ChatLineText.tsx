import React, { Dispatch, FC, SetStateAction, TouchEvent, useState } from "react"
import { useBoundStore } from "../hooks/useBoundStore";

type ChatLineTextProps = {
    text: string,
	isGreenText: boolean,
	isSlashMeMessage: boolean,
	isCurrentUserMessage: boolean,
	onMessageTextPress: (text: string, isEmbed?: boolean) => void,
	hasNsflLabel: string | undefined,
	hasNsfwLabel: string | undefined,
	setHasNsfwLink: Dispatch<SetStateAction<boolean>>,
	setHasNsflLink: Dispatch<SetStateAction<boolean>>
}

const urlRegex = new RegExp(/(http|https):\/\/(\S*)/);
const embedRegex = new RegExp(/^([#]{1}(twitch|youtube)\/(.+))$/);

export const ChatLineText: FC<ChatLineTextProps> = ({ isGreenText, text, isSlashMeMessage, isCurrentUserMessage, onMessageTextPress, hasNsflLabel, hasNsfwLabel, setHasNsflLink, setHasNsfwLink }) => {
	const isUrl = text.match(urlRegex);
	if (isUrl && hasNsfwLabel) {
		setHasNsfwLink(true);
	}
	if (isUrl && hasNsflLabel) {
		setHasNsflLink(true);
	}

	const isEmbed = text.match(embedRegex);

	const onTextPress = (event: TouchEvent<HTMLDivElement>) => {
		event.stopPropagation();
		onMessageTextPress(text);
	}

	const onEmbedPress = (event: TouchEvent<HTMLDivElement>) => {
		event.stopPropagation();
		onMessageTextPress(text, true);
	}

	if (isUrl) {
		return (
			<>
				<a href={text} className={`break-all text-[#02c2ff] ${hasNsfwLabel ? " nsfw-link" : ""} ${hasNsflLabel ? "nsfl-link" : ""}`}>&nbsp;{text}</a>
			</>
		)
    } 
	
	if (isEmbed) {
		return (
			<>
				<span onTouchEnd={onEmbedPress} className={`break-all text-[#02c2ff]`}>&nbsp;{text}</span>
			</>
		)
    } 

	return (
		<span onTouchEnd={onTextPress} className={`${isGreenText ? "text-[#6ca528]" : isCurrentUserMessage ? "text-[#dedede]" : "text-[#b9b9b9]"} ${isSlashMeMessage ? "italic" : ""} break-all`}>&nbsp;{text}</span>
	)
}
