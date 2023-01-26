import React, { FC, FormEvent, useCallback, useContext, useEffect, useRef, useState, KeyboardEvent, ChangeEvent} from "react"
import {
    IonFab,
    IonFabButton,
    IonFabList,
    IonMenuButton,
    IonInput,
    IonIcon,
    IonMenuToggle,
    IonButton
} from "@ionic/react";
import { menu } from "ionicons/icons";
import { ChatMenu } from "./ChatMenu";
import { useBoundStore } from "../hooks/useBoundStore";

type ChatInputContainerProps = {
	height: number,
	width: number,
	sendMessage: (message: string) => void
}

export const ChatInputContainer: FC<ChatInputContainerProps> = ({ height, width, sendMessage }) => {
	const { user } = useBoundStore();
	const [chatInput, setChatInput] = useState<string>("");

    const onInputKeyUp = useCallback(async (event: KeyboardEvent) => {
        if (event.key === "Enter") {
            console.log("enter pressed");
            sendMessage(chatInput);
            setChatInput("");
        }
	}, [chatInput]);

    const onInputChange = useCallback((event: ChangeEvent<HTMLIonInputElement>) => {
        setChatInput(event.target.value as string);

	}, []);

	return (
		<div className={`h-10 bg-black flex flex-row p-1 relative`}>
			<IonMenuToggle className={""}>
				<div className={"h-8 w-8 bg-blue-400 text-white rounded-full flex"}>
					<IonIcon className={"m-auto text-2xl"} icon={menu} />
				</div>
			</IonMenuToggle>

			<IonInput
				enterkeyhint={"send"}
				value={chatInput}
				onInput={onInputChange}
				onKeyUp={onInputKeyUp}
				placeholder={`Write something ${user?.nick}`}
				className={`text-white bg-light-black rounded-full ml-2`}
            />
		</div>
	);
}