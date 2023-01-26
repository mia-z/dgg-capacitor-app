import React, { FC, useContext, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import {DggAssets} from "../../hooks/DggAssetContext";
import {useBoundStore} from "../../hooks/useBoundStore";

type EmotesModalProps = {
    emotesModalOpen: boolean,
	setEmotesModalOpen: Dispatch<SetStateAction<boolean>>
}

export const EmotesModal: FC<EmotesModalProps> = ({ emotesModalOpen, setEmotesModalOpen }) => {
    const modalRef = useRef<HTMLIonModalElement>(null);
	const { emotes } = useContext(DggAssets);

	useEffect(() => {
		if (modalRef.current) {
			modalRef.current.addEventListener("didDismiss", () => {
				setEmotesModalOpen(false);
			});
		}
	}, [modalRef]);

	return (
		<IonModal className={""} id={"emotes-modal"} ref={modalRef} trigger={"emotes-modal"} isOpen={emotesModalOpen}>
			<IonContent>
				<div className={"bg-light-black h-full w-full flex flex-col"}>
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
                </div>
        	</IonContent>
		</IonModal>
    );
}