import React, { FC, useContext, useEffect, useRef, Dispatch, SetStateAction } from "react";
import {DggAssets} from "../../hooks/DggAssetContext";
import { CustomActionSheet } from "../common/CustomActionSheet";

type EmoteListActionSheetProps = {
    isOpen: boolean,
	setOpen: Dispatch<SetStateAction<boolean>>
}

export const EmoteListActionSheet: FC<EmoteListActionSheetProps> = ({ isOpen, setOpen }) => {
	const { emotes } = useContext(DggAssets);

	return (
		<CustomActionSheet isOpen={isOpen} setOpen={setOpen} name={"emotes"} extraConfig={{ handleKeyboard: true, cssClass: "action-sheet" }}>
			<div className={"h-full flex flex-col"}>
				<div className={"lobster text-3xl text-white text-center h-10"}>
					Emotes
				</div>
				<div className={"flex flex-row flex-wrap justify-center text-center h-[calc(100%-40px)] p-2 overflow-y-scroll"}>
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
		</CustomActionSheet>
    );
}