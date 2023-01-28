import { DateTime } from "luxon";
import React, { FC, useContext, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { useBoundStore } from "../../hooks/useBoundStore";
import { ChatMenuModal } from "../common/ChatMenuModal";

type VodsModalProps = {
	isOpen: boolean,
	setOpen: Dispatch<SetStateAction<boolean>>,
}

export const VodsModal: FC<VodsModalProps> = ({ isOpen, setOpen }) => {
	const { vodsInfo } = useBoundStore();

	return (
		<ChatMenuModal isOpen={isOpen} setOpen={setOpen}>
			<div className={"text-white roboto mt-2 text-3xl text-center"}>
				Latest VODs
			</div>
			<div className={"flex flex-col my-auto h-4/5"}>
				{
					vodsInfo?.map((vod, index) => (
						<div key={vod.id} className={"flex flex-row h-1/4 bg-[whitesmoke] m-2 rounded-sm"}>
							<div className={" w-1/3 flex relative"}>
								<img className={"my-auto rounded-sm rounded-l-none"} src={vod.highThumbnailUrl} />
								<div className={"absolute bottom-0 left-1 text-black lato text-[7pt]"}>
									{DateTime.fromISO(vod.streamStartTime).toFormat("EEEE, LLLL d")}
								</div>
							</div>
							<div className={"w-2/3 ml-2 flex flex-col"}>
								<div className={"my-auto roboto text-black text-sm"}>
									{vod.title}
								</div>
							</div>
						</div>
					))
				}
			</div>
		</ChatMenuModal>
	);
}