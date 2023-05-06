import { DateTime } from "luxon";
import React, { FC, useContext, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { useBoundStore } from "../../hooks/useBoundStore";
import { parseEmbedLink } from "../../lib/Helpers";
import { ChatMenuModal } from "../common/ChatMenuModal";
import { Platforms } from "../../contants";
import { CustomActionSheet } from "../common/CustomActionSheet";
import { CupertinoSettings } from "cupertino-pane";

const extraConfig: CupertinoSettings = {
	fitHeight: true
}

type VodsActionSheetProps = {
	isOpen: boolean,
	setOpen: Dispatch<SetStateAction<boolean>>,
}

export const VodsActionSheet: FC<VodsActionSheetProps> = ({ isOpen, setOpen }) => {
	const { vodsInfo, setCurrentEmbed, setUsingCustomEmbed } = useBoundStore();

	const onVideoClick = (vod: Vyneer.Vod) => {
		// if (!Platforms.some(x => x === vod.platform)) {
		// 	console.log(`${embed.platform} is not a supported embed, yet!`);
		// 	return;
		// }
		setCurrentEmbed({ videoId: vod.id, platform: "youtube", isDestiny: false });
		setUsingCustomEmbed(true);
		setOpen(false);
		return;
	}
	
	return (
		<CustomActionSheet isOpen={isOpen} setOpen={setOpen} name={"vods"} extraConfig={{ handleKeyboard: true, cssClass: "action-sheet" }}>
			<div className={"h-full flex flex-col"}>
				<div className={"lobster text-3xl text-white text-center h-10"}>
					VODs
				</div>
				<div className={"flex flex-row flex-wrap justify-center text-center h-[calc(100%-40px)] p-2 overflow-y-scroll"}>
					{
						vodsInfo?.map((vod, index) => (
							<div onClick={() => onVideoClick(vod)} key={vod.id} className={"shadow-xl flex p-1 flex-row h-12 bg-neutral m-2 rounded-md min-w-full active:bg-neutral-focus text-neutral-content"}>
								<div className={"w-11 flex relative"}>
									<img className={"w-10 h-10 rounded-md my-auto"} src={vod.thumbnail} />
								</div>
								<div className={"w-[calc(100%-54px)] h-11 ml-2 flex flex-col"}>
									<div className={"my-auto roboto truncate text-sm"}>
										{vod.title}
									</div>
									<div className={"relative bottom-0 text-left open-sans text-[7pt]"}>
										{DateTime.fromISO(vod.starttime).toFormat("EEEE, LLLL d")}
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