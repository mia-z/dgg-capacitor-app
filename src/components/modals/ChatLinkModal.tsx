import React, { FC, useContext, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import { HTTP } from "@awesome-cordova-plugins/http";

type EmotesModalProps = {
	chatLinkModalIsOpen: boolean,
	setChatLinkModalIsOpen: Dispatch<SetStateAction<boolean>>,
	link: string
}

export const ChatLinkModal: FC<EmotesModalProps> = ({ chatLinkModalIsOpen, setChatLinkModalIsOpen, link }) => {
	const modalRef = useRef<HTMLIonModalElement>(null);

	useEffect(() => {
		if (modalRef.current) {
			modalRef.current.addEventListener("didDismiss", () => {
				setChatLinkModalIsOpen(false);
			});
		}
	}, [modalRef]);

	return (
		<IonModal className={""} id={"emotes-modal"} ref={modalRef} trigger={"emotes-modal"} isOpen={chatLinkModalIsOpen}>
			<IonContent>
				<div className={"bg-light-black h-full w-full flex flex-col"}>
					<iframe src={link} />
				</div>
			</IonContent>
		</IonModal>
	);
}