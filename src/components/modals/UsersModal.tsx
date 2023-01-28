import React, {Dispatch, FC, SetStateAction, useContext, useEffect, useRef} from "react";
import {DggAssets} from "../../hooks/DggAssetContext";
import {useBoundStore} from "../../hooks/useBoundStore";
import { ChatMenuModal } from "../common/ChatMenuModal";

type UsersModalProps = {
	isOpen: boolean,
	setOpen: Dispatch<SetStateAction<boolean>>
}

export const UsersModal: FC<UsersModalProps> = ({ isOpen, setOpen }) => {
	const { chatUsers } = useBoundStore();
	const { flairs } = useContext(DggAssets);

    return (
		<ChatMenuModal isOpen={isOpen} setOpen={setOpen}>
			<div className={"grid grid-cols-3 grid-rows-1 grid-flow-row h-10 mt-2"}>
				<div className={"col-start-2 my-auto"}>
					<div className={"text-white roboto text-3xl text-center"}>
						Users
					</div>
				</div>
			</div>
			<div className={"flex flex-row flex-wrap h-[calc(100%-40px)] overflow-y-scroll"} onTouchMove={(e) => e.stopPropagation()}>
				<div className={"flex flex-row flex-wrap text-center justify-center"}>
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
		</ChatMenuModal>
    );
}