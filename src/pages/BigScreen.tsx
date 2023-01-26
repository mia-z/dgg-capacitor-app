import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import React, { FC, useContext, useEffect } from "react";
import messages from "../../test_messages.json";
import {ChatContainer} from "../components/ChatContainer";
import { useChat } from "../hooks/useChat";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { StreamContainer } from "../components/StreamContainer";
import { ChatInputContainer } from "../components/ChatInputContainer";
import { Redirect } from "react-router-dom";
import { useBoundStore } from "../hooks/useBoundStore";
import { DggAssetsContext } from "../hooks/DggAssetContext";
import {usePreferenceQueries} from "../hooks/usePreferenceQueries";
import {ChatMenu} from "../components/ChatMenu";

//Stub method used for testing the chat - is essentially a noop
const sendMessage = (message: string) => console.log("message sent " + message);

export const BigScreen: FC = () => {
	usePreferenceQueries();

	const { authToken, user } = useBoundStore();

	const { sendMessage }  = useChat(authToken);

    const { width, height } = useWindowDimensions();

	if (authToken === "" || user === null) {
        return <Redirect to={"/login"} />
    }

    return (
		<IonPage>
			<DggAssetsContext>
				<ChatMenu />
				<IonContent id={"bigscreen-content"}>
					<div className={"flex flex-col bg-light-black"} style={{ height: height }}>
						<StreamContainer height={height} width={width} />
						<ChatContainer height={height} width={width} />
						<ChatInputContainer height={height} width={width} sendMessage={sendMessage} />
					</div>
            	</IonContent>
			</DggAssetsContext>
        </IonPage>
	);
};