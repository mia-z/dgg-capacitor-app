import React, { FC, memo, MouseEvent, TouchEvent, useCallback, useContext, useState } from "react";
import { ChatLineEmote } from "./ChatLineEmote";
import { ChatLineText } from "./ChatLineText";
import { useBoundStore } from "../hooks/useBoundStore";
import { ChatEmoteCombo } from "./ChatEmoteCombo";
import { DggAssets } from "../hooks/DggAssetContext";
import { parseEmbedLink } from "../lib/Helpers";
import { Platforms } from "../contants";

const ChatLine: FC<ChatMessage> = ({ nick, data, features, timestamp, isHidden, isSameNickAsPrevious, comboCount, isEmoteComboFinished, isEmoteComboMessage }) => {
    const { showUserMessages, user, watchingNicks, addNickToWatch, removeNickToWatch, chatUsers, setWatchingNicks,setCurrentEmbed, setUsingCustomEmbed } = useBoundStore();
    const { emotes, flairs, emoteRegex } = useContext(DggAssets);

	const [hasNsfwLink, setHasNsfwLink] = useState<boolean>(false);
	const [hasNsflLink, setHasNsflLink] = useState<boolean>(false);

    const flairsToUse = flairs?.filter((flair, index) => {
        return features.includes(flair.name)
    });

    const isGreenText = data.charAt(0) === ">";

	const isSlashMeMessage = data.startsWith("/me");
	if (isSlashMeMessage) {
		data = data.slice(3);
	}

	const isCurrentUser = nick.toLowerCase() === user?.nick;

	const isTaggingCurrentUser = !isCurrentUser && user && data.includes(user?.nick);

	const isWatchingNicks = watchingNicks.length > 0;

	const isWatchingThisNick = isWatchingNicks && watchingNicks.some(x => x.toLowerCase() === nick.toLowerCase());

	const hasNsfwLabel = data.match(/(nsfw)+/i)?.[0];

	const hasNsflLabel = data.match(/(nsfl)+/i)?.[0];

	const onNickPress = useCallback((event: MouseEvent<HTMLSpanElement>) => {
		event.stopPropagation();
		if (watchingNicks.some(x => x.toLowerCase() === nick.toLowerCase())) {
			removeNickToWatch(nick);
		} else {
			addNickToWatch(nick);
		}
	}, [watchingNicks]);

	const onMessageTextPress = useCallback((text: string, isEmbed: boolean = false) => {
		if (isEmbed) {
			const embed = parseEmbedLink(text);
			if (!embed) {
				console.log("couldnt parse embed!");
				return;
			}
			if (!Platforms.some(x => x === embed.platform)) {
				console.log(`${embed.platform} is not a supported embed, yet!`);
				return;
			}
			setCurrentEmbed(embed);
			setUsingCustomEmbed(true);
			return;
		}

		if (chatUsers.some(x => text.toLowerCase().includes(x.nick.toLowerCase()))) {
			const textAsNick = chatUsers.find(x => text.toLowerCase().includes(x.nick.toLowerCase()));

			if (!textAsNick) return; //In some high traffic conditions, the nick-text matching could end up being null. VERY rare, but probably best to put this here

			if (watchingNicks.some(x => textAsNick.nick.toLowerCase().includes(x.toLowerCase()))) {
				removeNickToWatch(textAsNick.nick);
			} else {
				if (!watchingNicks.some(x => x.toLowerCase() === nick.toLowerCase())) {
					addNickToWatch(nick);
				}
				addNickToWatch(textAsNick.nick);
			}
		}
	}, [watchingNicks, chatUsers]);

	const onChatLinePress = (event: MouseEvent<HTMLDivElement>) => {
		setWatchingNicks([]);
	}

	if (isEmoteComboMessage) {
        const emote = emotes!.find(x => x.prefix === data);
        return (
			<ChatEmoteCombo emote={emote!} comboCount={comboCount} isEmoteComboFinished={isEmoteComboFinished} isEmoteComboMessage={isEmoteComboMessage} />
        );
    }

	return (
		<div key={`${timestamp}`} onClick={onChatLinePress} className={`flex flex-row flex-wrap msg-chat ${isCurrentUser ? "bg-[#212121]" : ""} ${isTaggingCurrentUser ? "bg-[#06263e]" : ""} ${(isWatchingNicks && isWatchingThisNick) ? "opacity-100" : isWatchingNicks ? "opacity-50" : ""}`}>
			{
				isSameNickAsPrevious ?
				<>
					<span>&gt;&nbsp;</span>
				</> :
				<>
					{
						flairsToUse.filter(x => !x.hidden).map((flair, index) => (
                            <React.Fragment key={`${flair.name}${index}${timestamp}`}>
								<img
									className={"my-auto"}
									style={{ height: flair.image[0].height, width: flair.image[0].width }}
									src={flair.image[0].url}
                                />
								<span>&nbsp;</span>
                            </React.Fragment>
						))
					}
					<span onClick={onNickPress} className={"text-white user font-bold " + flairsToUse?.map(x => x.name).reverse().join(" ")} >
						{nick}
					</span>
					{	!isSlashMeMessage &&
						<span className={"text-white"}>
							:&nbsp;
						</span>
					}
				</>
			}
			{
				isHidden ?
				<span onTouchEnd={() => showUserMessages(nick)} className={"text-blue-400 underline"}>censored</span> :
				data.split(" ").map((string, index) => {
                    if (string.match(emoteRegex)) {
                        const emote = emotes!.find(x => x.prefix === string);
                        return <ChatLineEmote key={`${string}${timestamp}${index}`} emote={emote!} />;
                    } else {
						return <ChatLineText 
							key={`${string}${timestamp}${index}`}
							setHasNsflLink={setHasNsflLink} 
							setHasNsfwLink={setHasNsfwLink} 
							hasNsflLabel={hasNsflLabel} 
							hasNsfwLabel={hasNsfwLabel} 
							onMessageTextPress={onMessageTextPress} 
							isGreenText={isGreenText} 
							isCurrentUserMessage={isCurrentUser} 
							isSlashMeMessage={isSlashMeMessage} 
							text={string} />;
                    }
                })
			}
		</div>
	);
}


//export default ChatLine;
export default memo(ChatLine);


