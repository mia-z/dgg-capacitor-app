import React, {FC} from "react";

type ChatLineEmoteProps = {
    emote: ChatEmote
}

export const ChatLineEmote: FC<ChatLineEmoteProps> = ({ emote }) => {
    return (
		<div className={"emote-wrapper"}>
			<div className={` emote ${emote.prefix}`} style={{ backgroundImage: `url(${emote.image[0].url})` }}>
				{/* OOOO */}
			</div>
		</div>
	);
}