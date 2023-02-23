import React, { FC, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { useBoundStore } from "../../hooks/useBoundStore";
import { parseEmbedLink } from "../../lib/Helpers";
import { ChatMenuModal } from "../common/ChatMenuModal";
import { useIonAlert } from "@ionic/react";
import { CustomActionSheet } from "../common/CustomActionSheet";
import { CupertinoSettings } from "cupertino-pane";
import { PlatformPill } from "../common/PlatformPill";

type ChatEmbedsActionSheetProps = {
	isOpen: boolean,
	setOpen: Dispatch<SetStateAction<boolean>>,
}

const extraConfig: CupertinoSettings = {
	fitHeight: true
}

const couldntParseAlertProps = {
	header: "Error",
	message: "Couldnt parse that embed link!",
	buttons: ["Ok"]
}

export const ChatEmbedsActionSheet: FC<ChatEmbedsActionSheetProps> = ({ isOpen, setOpen }) => {
	const { last5Embeds, recentEmbeds, setCurrentEmbed, setUsingCustomEmbed } = useBoundStore();

	const [presentAlert] = useIonAlert();

	const updateEmbed = (link: string) => {
		const embed = parseEmbedLink(link);
		if (!embed) {
			presentAlert(couldntParseAlertProps);
			return;
		}
		setCurrentEmbed(embed);
		setUsingCustomEmbed(true);
		setOpen(false);
	}

	return (
		<CustomActionSheet isOpen={isOpen} setOpen={setOpen} name={"chatembeds"} extraConfig={{ handleKeyboard: true, cssClass: "action-sheet", ...extraConfig }}>
			<div className={"h-full flex flex-col"}>
				<div className={"lobster text-3xl text-white text-center h-10"}>
					Chat Embeds
				</div>
				<div className={"p-2 m-2"}>
					<div className={"underline text-white lobster mt-2 text-xl text-center"}>
						Last 5 embeds
					</div>
					<div className={"flex flex-col space-y-2 mt-2"}>
						{
							last5Embeds.map((embed, index) => (
								<PlatformPill key={`${embed.timestamp}-${embed.channel}`} onClick={() => updateEmbed(embed.link)} link={embed.link} extraText={embed.title} />
							))
						}
					</div>
				</div>
				<div className={"p-2 m-2 "}>
					<div className={"underline text-white lobster mb-2 mt-5 text-xl text-center"}>
						Embeds from the past hour
					</div>
					<div className={"flex flex-col space-y-2"}>
						{
							recentEmbeds.length < 1 ?
							<div className={"flex flex-col"}>
								<img className={"mx-auto"} src={"https://cdn.destiny.gg/2.60.0/emotes/6296cf7e8ccd0.png"} />
								<div className={"lobster text-lg text-white text-center"}>
									No embeds from the past hour
								</div>
							</div> :
							recentEmbeds.map((embed, index) => (
								<PlatformPill key={`${embed.timestamp}-${embed.channel}`} onClick={() => updateEmbed(embed.link)} link={embed.link} extraText={embed.title} />
							))
						}
					</div>
				</div>
			</div>
		</CustomActionSheet>
	);
}