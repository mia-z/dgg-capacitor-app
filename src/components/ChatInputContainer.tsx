import React, { FC, FormEvent, useCallback, useContext, useEffect, TouchEvent, useState, KeyboardEvent, ChangeEvent, useMemo} from "react"
import { IonFab, IonFabButton, IonFabList, IonMenuButton, IonInput, IonIcon, IonMenuToggle, IonButton } from "@ionic/react";
import { menu } from "ionicons/icons";
import { ChatMenu } from "./ChatMenu";
import { useBoundStore } from "../hooks/useBoundStore";
import { DggAssets } from "../hooks/DggAssetContext";

type ChatInputContainerProps = {
	height: number,
	width: number,
	sendMessage: (message: string) => void
}

export const ChatInputContainer: FC<ChatInputContainerProps> = ({ height, width, sendMessage }) => {
	const { user, chatUsers } = useBoundStore();
	const assets = useContext(DggAssets);
	
	const [chatInput, setChatInput] = useState<string>("");
	const [emoteSuggestions, setEmoteSuggestions] = useState<string[]>([]);
	const [chatterSuggestions, setChatterSuggestions] = useState<string[]>([]);
	const [suggestionsShowing, setSuggestionsShowing] = useState<boolean>(false);

    const onInputKeyUp = useCallback(async (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            console.log("enter pressed");
            sendMessage(chatInput);
            setChatInput("");
        }
	}, [chatInput]);

    const onInputChange = useCallback((event: ChangeEvent<HTMLIonInputElement>) => {
        setChatInput(event.target.value as string);
	}, []);

	useMemo(() => {
		const latestWord = chatInput.split(" ")[chatInput.split(" ").length -1].toLowerCase();
		let emotes: string[] = [];
		let chatters: string[] = [];
		
		if (latestWord.length > 2) {
			chatters = chatUsers.filter(user => user.nick.toLowerCase().startsWith(latestWord)).map(user => user.nick);
			emotes = assets.emotes.filter(emote => emote.prefix.toLocaleLowerCase().startsWith(latestWord)).map(emote => emote.prefix);
		}

		if (chatters.length > 0 || emotes.length > 0) {
			setEmoteSuggestions(emotes);
			setChatterSuggestions(chatters);
			setSuggestionsShowing(true);
		} else {
			setSuggestionsShowing(false);
		}
	}, [chatUsers, chatInput]);

	const replaceLatestWord = useCallback((event: TouchEvent<HTMLDivElement>, replacement: string) => {
		event.stopPropagation();
		event.preventDefault();
		const splitInput = chatInput.split(" ");
		splitInput[splitInput.length - 1] = replacement;
		setChatInput(splitInput.join(" "));
	}, [chatInput]);

	return (
		<div className={`h-10 bg-black flex flex-row p-1 relative`}>
			<div className={`absolute ${(suggestionsShowing) ? "h-10 -top-10" : "h-0 -top-0"} -right-2 left-0 z-50 transition-all flex flex-row overflow-x-scroll w-[calc(100%-2px)] bg-black rounded-t-xl border-t border-x border-t-blue-400 border-x-blue-400`}>
				{
					emoteSuggestions.concat(chatterSuggestions).map((suggestion, index) => (
						<div key={`suggestion-${index}`} onTouchEnd={(event: TouchEvent<HTMLDivElement>) => replaceLatestWord(event, suggestion)} className={"text-[#dedede] mx-1 roboto my-auto rounded-full bg-light-black px-2 py-1"}>
							{suggestion}
						</div>
					))
				}
			</div>
			<IonMenuToggle className={""}>
				<div className={"h-8 w-8 bg-blue-400 text-white rounded-full flex"}>
					<IonIcon className={"m-auto text-2xl"} icon={menu} />
				</div>
			</IonMenuToggle>
			<IonInput
				enterkeyhint={"send"}
				value={chatInput}
				onInput={onInputChange}
				onKeyUp={onInputKeyUp}
				placeholder={`Write something ${user?.nick}`}
				className={`text-white bg-light-black rounded-full ml-2`}
            />
		</div>
	);
}