import React, { FC, useContext, useEffect, useRef, Dispatch, SetStateAction } from "react";
import {DggAssets} from "../../hooks/DggAssetContext";
import { ChatMenuModal } from "../common/ChatMenuModal";

type EmotesModalProps = {
    isOpen: boolean,
	setOpen: Dispatch<SetStateAction<boolean>>
}

export const EmotesModal: FC<EmotesModalProps> = ({ isOpen, setOpen }) => {
	const { emotes } = useContext(DggAssets);

	return (
		<ChatMenuModal isOpen={isOpen} setOpen={setOpen}>
			<div className={"grid grid-cols-3 grid-rows-1 grid-flow-row h-10 mt-2"}>
				<div className={"col-start-2 my-auto"}>
					<div className={"text-white roboto text-3xl text-center"}>
						Emotes
					</div>
				</div>
			</div>
			<div className={"flex flex-row flex-wrap h-[calc(100%-40px)] overflow-y-scroll"} onTouchMove={(e) => e.stopPropagation()}>
				<div className={"flex flex-row flex-wrap text-center justify-center"}>
					{
						emotes.map(({ prefix, image }, index) => {
							return (
								<div className={`mx-1 text-white`} key={prefix}>
									<div className={`emote ${prefix}`} style={{ backgroundImage: `url(${image[0].url})` }}>
									{/* OOOO */}
									</div>
									<div className={`text-xs`}>
										{prefix}
									</div>
								</div>
							)
						})
					}
				</div>
			</div>
		</ChatMenuModal>
    );
}