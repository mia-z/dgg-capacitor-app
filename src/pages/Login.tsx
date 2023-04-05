import {IonContent, useIonRouter, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonModal, IonSpinner, IonFab, IonFabButton, IonIcon} from "@ionic/react";
import React, {FC, useCallback, useContext, useEffect, useRef, useState} from "react";
import { Browser } from "@capacitor/browser";
import { Clipboard } from '@capacitor/clipboard';
import {GetLoginToken, GetUserData, HasSeenLoginInfo, SetLoginToken, SetUserData} from "../lib/PreferencesHelper";
import { Redirect } from "react-router-dom";
import {useQuery} from "react-query";
import {useBoundStore} from "../hooks/useBoundStore";
import { UserDataQuery } from "../lib/Queries";
import {usePreferenceQueries} from "../hooks/usePreferenceQueries";
import {LoginHelp} from "../components/modals/LoginHelp";
import { help, informationCircleOutline, informationCircle } from "ionicons/icons";
import dggLogo from "../styles/img/dgg-logo.png";

export const Login: FC = () => {
	const { authToken, setAuthToken, user, setUser } = useBoundStore();

	const [loginString, setLoginString] = useState<string | null>();

	const { token, userData } = usePreferenceQueries();

	const [loginHelpOpen, setLoginHelpOpen] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			const seen = await HasSeenLoginInfo();
			if (!seen) {
				setLoginHelpOpen(true);
			}
		})();
	}, []);

	const fetchUserDataQuery = useQuery({
		queryKey: ["fetchedUserData", loginString],
		queryFn: async () => await UserDataQuery(loginString as string),
		onSuccess: async (result) => {
			if (result) {
				await SetUserData(result);
				await SetLoginToken(loginString as string);
				setUser(result);
				setAuthToken(loginString as string);
			}
		},
		enabled: !!loginString,
		refetchInterval: false
	});

	const loginPress = async () => {
		await Browser.open({ url: "https://destiny.gg/login", presentationStyle: "popover" });
		Browser.addListener("browserFinished", browserCloseHandler);
	}

	const browserCloseHandler = async () => {
		const { type, value } = await Clipboard.read();
        console.log(type, value);
        await Browser.removeAllListeners();
        setLoginString(value);
    }

	if ((authToken != null && authToken != "") && user != null) {
		return <Redirect to={"/bigscreen"} />
	}

	return (
		<IonPage>
			<IonContent>
				<div className={"bg-light-black h-full flex flex-col"}>
					<div className={"mt-auto w-3/4 mx-auto relative shine"}>
						<img src={dggLogo}  />
                    </div>
					<div className={"flex flex-col mb-auto w-2/3 mx-auto"}>
						<IonButton onClick={loginPress} className={`transition-all ${(fetchUserDataQuery.isLoading || fetchUserDataQuery.isSuccess) ? "h-0 mt-0" : "h-10 mt-10"} `}>
							Login
                        </IonButton>
						<IonSpinner name={"crescent"} className={`text-blue-400 mx-auto transition-all ${(fetchUserDataQuery.isLoading || fetchUserDataQuery.isSuccess) ? "h-10" : "h-0"}`} />
                    </div>
                </div>
				<div className={"absolute bottom-8 right-24 text-light-black rounded p-3 text-center w-2/3 mt-3 work-sans mx-auto shadow-lg text-xs bg-[whitesmoke]"}>
					If you're unsure how to log in, press the info button on the right!
					<img className={"absolute -bottom-4 -right-2"} src={"https://cdn.destiny.gg/2.60.0/emotes/6296cf7e8ccd0.png"} />
				</div>
				<IonFab slot={"fixed"} vertical={"bottom"} horizontal={"end"} >
					<IonFabButton size={"small"} onTouchEnd={() => setLoginHelpOpen(true)}>
						<IonIcon icon={informationCircleOutline}></IonIcon>
					</IonFabButton>
				</IonFab>
				<LoginHelp loginHelpOpen={loginHelpOpen} setLoginHelpOpen={setLoginHelpOpen} />
			</IonContent>
		</IonPage>
	);
};