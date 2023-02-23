import { CupertinoSettings } from "cupertino-pane";
import { DateTime } from "luxon";
import React, { FC, useContext, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Platforms } from "../../contants";
import { useBoundStore } from "../../hooks/useBoundStore";
import { parseEmbedLink } from "../../lib/Helpers";
import { ChatMenuModal } from "../common/ChatMenuModal";
import { CustomActionSheet } from "../common/CustomActionSheet";

type VideosActionSheetlProps = {
	isOpen: boolean,
	setOpen: Dispatch<SetStateAction<boolean>>,
}

const extraConfig: CupertinoSettings = {
	fitHeight: true
}

export const VideosActionSheet: FC<VideosActionSheetlProps> = ({ isOpen, setOpen }) => {
	const { videosInfo, setCurrentEmbed, setUsingCustomEmbed } = useBoundStore();

	const onVideoClick = (link: string) => {
		console.log(link);
		const embed = parseEmbedLink(link);
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
		setOpen(false);
		return;
	}

	return (
		<CustomActionSheet isOpen={isOpen} setOpen={setOpen} name={"videos"} extraConfig={{ handleKeyboard: true, cssClass: "action-sheet", ...extraConfig }}>
		<div className={"h-full flex flex-col"}>
			<div className={"lobster text-3xl text-white text-center h-10"}>
				Youtube Videos
			</div>
			<div className={"flex flex-row flex-wrap justify-center text-center h-[calc(100%-40px)] p-2 overflow-y-scroll"}>
				{
					videosInfo?.videos?.map((video, index) => (
						<div onClick={() => onVideoClick(video.url)} key={video.id} className={"shadow-lg flex p-1 flex-row h-12 bg-[whitesmoke] m-2 rounded-full w-full active:bg-slate-300"}>
							<div className={"w-11 flex relative"}>
								<img className={"w-10 h-10 rounded-full my-auto"} src={video.highThumbnailUrl} />
							</div>
							<div className={"w-[calc(100%-54px)] h-11 ml-2 flex flex-col"}>
								<div className={"my-auto roboto truncate text-black text-sm"}>
									{video.title}
								</div>
							</div>
						</div>
					))
				}
			</div>
		</div>
	</CustomActionSheet>
	);
}