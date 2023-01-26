import React, {FC} from "react";

type ChatEmoteComboProps = {
    emote: ChatEmote,
	comboCount: number,
	isEmoteComboMessage: boolean,
	isEmoteComboFinished: boolean
}
// 5 10 20 30 50
export const ChatEmoteCombo: FC<ChatEmoteComboProps> = ({ emote, comboCount, isEmoteComboMessage, isEmoteComboFinished }) => {
	const comboBreakpoint = comboCount < 6 ? "" :
			comboCount > 4 && comboCount < 10 ? "5" :
			comboCount > 9 && comboCount < 20 ? "10" :
			comboCount > 19 && comboCount < 30 ? "20" :
			comboCount > 29 && comboCount < 50 ? "30" : "50";
    return (
		isEmoteComboFinished ?
		<div className={`msg-chat ${emote.prefix}`}>
			<div className={`emote ${emote.prefix}`} style={{ backgroundImage: `url(${emote.image[0].url})` }}>
				{/* OOOO */}
			</div>
			<span className={`emote-wrapper chat-combo x${comboBreakpoint} combo-complete`}>
				<i className={"count"}>{comboCount}</i>
				<i className={"x"}>&nbsp;X</i>
				<i className={"combo"}>C-C-C-COMBO</i>
			</span>
		</div> :
		<div className={`msg-chat ${emote.prefix}`}>
			<div className={`emote ${emote.prefix}`} style={{ backgroundImage: `url(${emote.image[0].url})` }}>
				{/* OOOO */}
			</div>
			<span className={`emote-wrapper chat-combo x${comboBreakpoint} leading-6`}>
				<i className={"count"}>{comboCount}</i>
				<i className={"x"}>&nbsp;X&nbsp;</i>
				<i className={"hit"}>hits</i>
			</span>
		</div>
	);
}