import { DateTime } from "luxon";
import React, { FC, useContext, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { useBoundStore } from "../../hooks/useBoundStore";
import { ChatMenuModal } from "../common/ChatMenuModal";

type VideosModalProps = {
	isOpen: boolean,
	setOpen: Dispatch<SetStateAction<boolean>>,
}

export const VideosModal: FC<VideosModalProps> = ({ isOpen, setOpen }) => {
	const { videosInfo } = useBoundStore();

	return (
		<ChatMenuModal isOpen={isOpen} setOpen={setOpen}>
			<div className={"text-white roboto mt-2 text-3xl text-center"}>
				Latest Videos
			</div>
			<div className={"flex flex-col my-auto h-4/5"}>
				{
					videosInfo?.videos?.map((video, index) => (
						<div key={video.id} className={"flex flex-row h-1/4 bg-[whitesmoke] m-2 rounded-sm"}>
							<div className={" w-1/3 flex relative"}>
								<img className={"my-auto rounded-sm rounded-l-none"} src={video.highThumbnailUrl} />
							</div>
							<div className={"w-2/3 ml-2 flex flex-col"}>
								<div className={"my-auto roboto text-black text-sm"}>
									{video.title}
								</div>
							</div>
						</div>
					))
				}
			</div>
		</ChatMenuModal>
	);
}