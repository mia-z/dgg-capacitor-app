import { IonActionSheet } from "@ionic/react";
import { CupertinoPane, CupertinoSettings } from "cupertino-pane";
import React, { Dispatch, FC, SetStateAction, useContext, useEffect, useRef } from "react";
import { DggAssets } from "../../hooks/DggAssetContext";
import { useBoundStore } from "../../hooks/useBoundStore";
import { ChatMenuModal } from "../common/ChatMenuModal";
import { CustomActionSheet } from "../common/CustomActionSheet";

type UserListActionSheetProps = {
	isOpen: boolean,
	setOpen: Dispatch<SetStateAction<boolean>>
}

export const UserListActionSheet: FC<UserListActionSheetProps> = ({ isOpen, setOpen }) => {
	const { chatUsers } = useBoundStore();
	const { flairs } = useContext(DggAssets);

    return (
		<CustomActionSheet isOpen={isOpen} setOpen={setOpen} name={"users"} extraConfig={{ handleKeyboard: true, cssClass: "action-sheet" }}>
			<div className={"h-full flex flex-col"}>
				<div className={"lobster text-3xl text-white text-center h-10"}>
					Chatters
				</div>
				<div className={"flex flex-row flex-wrap justify-center text-center h-[calc(100%-40px)] p-2 overflow-y-scroll"}>
					{
						chatUsers.map(({ nick, features }, index) => {
							const flairsToUse = flairs?.filter((flair, index) => {
								return features.includes(flair.name)
							});
							return (
								<div className={"mx-1 text-white user " + flairsToUse?.map(x => x.name).reverse().join(" ")} key={nick}>
									{nick}
								</div>
							)
						})
					}
				</div>
			</div>
		</CustomActionSheet>
    );
}