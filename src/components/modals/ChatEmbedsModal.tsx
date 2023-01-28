import React, { FC, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { useBoundStore } from "../../hooks/useBoundStore";
import { ChatMenuModal } from "../common/ChatMenuModal";

type ChatEmbedsModalProps = {
	isOpen: boolean,
	setOpen: Dispatch<SetStateAction<boolean>>,
}

export const ChatEmbedsModal: FC<ChatEmbedsModalProps> = ({ isOpen, setOpen }) => {
	const { last5Embeds, recentEmbeds } = useBoundStore();

	return (
		<ChatMenuModal isOpen={isOpen} setOpen={setOpen}>
			<div className={"text-white roboto mt-2 text-3xl text-center"}>
				Chat Embeds
			</div>
			<div className={"underline text-white roboto mt-2 text-xl text-center"}>
				Last 5 embeds
			</div>
			<div className={"flex flex-col space-y-2 mt-2"}>
				{
					last5Embeds.map((embed, index) => (
						<div key={`${embed.timestamp}-${embed.channel}`} className={"flex flex-col px-2"}>
							<div className={"truncate text-center text-[whitesmoke] roboto"}>
								<span className={"underline text-blue-600"}>{embed.link}</span>&nbsp;-&nbsp;{embed.title}
							</div>
						</div>
					))
				}
			</div>
			<div className={"underline text-white roboto mb-2 mt-5 text-xl text-center"}>
				Embeds from the past hour
			</div>
			<div className={"flex flex-col space-y-2"}>
				{
					recentEmbeds.map((embed, index) => (
						<div key={`${embed.timestamp}-${embed.channel}`} className={"flex flex-col px-2"}>
							<div className={"truncate text-center text-[whitesmoke] roboto"}>
								<span className={"underline text-blue-600"}>{embed.link}</span>&nbsp;-&nbsp;{embed.title}
							</div>
						</div>
					))
				}
			</div>
		</ChatMenuModal>
	);
}