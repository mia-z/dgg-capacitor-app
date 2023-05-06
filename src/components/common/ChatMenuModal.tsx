import React, { FC, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { IonContent, IonModal } from "@ionic/react";

type ChatMenuModalProps = {
	isOpen: boolean,
	setOpen: Dispatch<SetStateAction<boolean>>,
    children: React.ReactNode[] | React.ReactNode
}

export const ChatMenuModal: FC<ChatMenuModalProps> = ({ isOpen, setOpen, children }) => {
	const modalRef = useRef<HTMLIonModalElement>(null);

	useEffect(() => {
		if (modalRef.current) {
			modalRef.current.addEventListener("didDismiss", () => {
				setOpen(false);
			});
		}
	}, [modalRef]);

	return (
		<IonModal className={""} id={"emotes-modal"} ref={modalRef} trigger={"emotes-modal"} isOpen={isOpen}>
			<IonContent>
				<div className={"bg-base-100 h-full w-full flex flex-col"}>
					{children}
				</div>
			</IonContent>
		</IonModal>
	);
}