import { FC, useCallback, useContext, useRef, useState } from "react";
import {IonAlert, IonButton, IonContent, IonIcon, IonMenu, useIonAlert, useIonRouter} from "@ionic/react";
import { peopleOutline, desktopOutline, happyOutline, closeOutline, settingsSharp, logOutOutline } from "ionicons/icons";
import { UsersModal } from "./modals/UsersModal";
import { EmotesModal } from "./modals/EmotesModal";
import { useBoundStore } from "../hooks/useBoundStore";
import { DggAssets } from "../hooks/DggAssetContext";
import { DateTime } from "luxon";
import React from "react";
import HumanizeDuration from "humanize-duration";
import {ClearUserData} from "../lib/PreferencesHelper";
import { ChatEmbedsModal } from "./modals/ChatEmbedsModal";
import { VodsModal } from "./modals/VodsModal";
import { VideosModal } from "./modals/VideosModal";
import { parseEmbedLink } from "../lib/Helpers";

const memePhrases = [
	"YEE wins",
	"PEPE wins",
	"For me, personally..",
	"Hey buddy you wanna hop on discord and chat about it? :)",
	"Off the penjamin",
	"Sounds good, anything else?"
];

type ChatMenuProps = {
}

const notImplementedAlertProps = {
	header: "Not implemented yet",
	subHeader: "This feature is coming soon, I promise!",
	buttons: ["Ok"]
}

const noVodsAlertProps = {
	header: "No vods",
	subHeader: "Couldnt find any vods, try again in a few minutes",
	buttons: ["Ok"]
}

export const ChatMenu: FC<ChatMenuProps> = ({ }) => {
	const sideMenuRef = useRef<HTMLIonMenuElement>(null);

	const router = useIonRouter();

	const [presentAlert] = useIonAlert();

	const { user, streamInfo, currentEmbed, togglePlayer, playerIsHidden, setUser, setAuthToken, setCurrentEmbed, setUsingCustomEmbed, vodsInfo } = useBoundStore();

	const { emotes, flairs } = useContext(DggAssets);

	const [logoutAlertOpen, setLogoutAlertOpen] = useState<boolean>(false);
	const [logoutLoadingAlertOpen, setLogoutLoadingAlertOpen] = useState<boolean>(false);

	const flairsToUse = flairs?.filter((flair, index) => {
		return user?.features.includes(flair.name)
	});

    const [usersModalOpen, setUsersModalOpen] = useState<boolean>(false);
	const [emotesModalOpen, setEmotesModalOpen] = useState<boolean>(false);
    const [embedsModalOpen, setEmbedsModalOpen] = useState<boolean>(false);
    const [vodsModalOpen, setVodsModalOpen] = useState<boolean>(false);
	const [videosModalOpen, setVideosModalOpen] = useState<boolean>(false);

	const onUsersButtonPress = () => {
		setUsersModalOpen(true);
	}

	const onEmotesButtonPress = () => {
		setEmotesModalOpen(true);
	}

	const onLogoutConfirm = async () => {
		setAuthToken("");
		setUser(null);
		await ClearUserData();
		router.push("/login");
		setLogoutLoadingAlertOpen(false);
	}

	const onPlayLatestVod = useCallback(() => {
		if (!vodsInfo || (vodsInfo && vodsInfo?.length < 1 && !vodsInfo[0])) {
			presentAlert(noVodsAlertProps);
			return;
		}

		const embed = parseEmbedLink(vodsInfo[0].url);
		if (embed) {
			setCurrentEmbed(embed);
			sideMenuRef.current!.close();
		} else {
			console.log("couldnt parse latest embed url!");
		}

	}, [vodsInfo, sideMenuRef]);

	return (
		<>
			<IonMenu ref={sideMenuRef} id={"side-menu"} menuId={"side-menu"} contentId={"bigscreen-content"}>
				<IonContent>
					<div className={"bg-light-black h-full w-full flex flex-col relative"}>
						<IonIcon onTouchEnd={() => presentAlert(notImplementedAlertProps)} className={"absolute left-5 top-5 text-white h-6 w-6 active:text-blue-400 transition-all"} icon={settingsSharp} />
						<IonIcon onTouchEnd={() => setLogoutAlertOpen(true)} className={"absolute right-5 top-5 text-white h-6 w-6 active:text-blue-400 transition-all"} icon={logOutOutline} />
						<div className={"lobster text-3xl text-white my-2 text-center"}>
							Appstiny
						</div>
						<div id={"user-card"} className={`flex flex-col bg-slate-600 h-24 p-2 m-3 rounded relative ${user?.team === "YEE" ? "yee" : user?.team === "PEPE" ? "pepe" : ""}`}>
							<div className={"grid grid-cols-3 h-full"}>
								<div className={"col-start-1 flex flex-col my-auto h-full"}>
									<div className={"text-center roboto text-white mb-2"}>
										Team
									</div>
									{
										user?.team === "YEE" ?
											<img className={"mx-auto h-8 w-8"} src={"https://cdn.destiny.gg/2.60.0/emotes/5c2bbe330b357.png"} /> :
										user?.team === "PEPE" ?
											<img className={"mx-auto h-8 w-8"} src={"https://cdn.destiny.gg/2.60.0/emotes/6157386b7d2fc.png"} /> :
										<div className={"text-white text-xs text-center"}>None set! <br /> you can do this on your profile on the DGG website!</div>
									}
								</div>
								<div className={"col-start-2 flex flex-col my-auto h-full"}>
									<div className={"text-center mb-2 text-white user " + flairsToUse?.map(x => x.name).reverse().join(" ")} >
										{user?.nick}
									</div>
									<div className={"flex flex-row flex-wrap justify-center"}>
										{
											flairsToUse?.filter(x => !x.hidden).map((flair, index) => (
												<React.Fragment key={`${flair.name}`}>
													<img
														className={"my-auto"}
														style={{ height: flair.image[0].height, width: flair.image[0].width }}
														src={flair.image[0].url}
													/>
													<span>&nbsp;</span>
												</React.Fragment>
											))
										}
									</div>
								</div>
								<div className={"col-start-3 flex flex-col my-auto h-full"}>
									<div className={"text-center roboto text-white mb-2"}>
										Member since:
									</div>
									<div className={"text-center roboto text-white"}>
										{DateTime.fromISO(user?.createdDate!).toFormat("yyyy/MM/dd")}
									</div>
								</div>
							</div>
						</div>
						<hr className={"w-[85%] mx-auto my-2"} />
						<div className={"flex flex-col"}>
							{
								streamInfo?.streams.youtube.live ?
								<>
									<div className={"text-center roboto text-white"}>
										Destiny is <span className={"font-bold text-emerald-400"}>LIVE</span>
									</div>
									<div className={"mx-auto mt-1"}>
										<img src={"https://cdn.destiny.gg/2.60.0/emotes/5c2bbb9fa8ab2.png"} />
									</div>
									<div className={"text-center roboto text-[8pt] text-[#b9b9b9] mt-1 px-2"}>
										Stream started at&nbsp;
										{DateTime.fromISO(streamInfo?.streams.youtube.started_at).toFormat("HH:mm")},&nbsp;
										live for&nbsp;
										{HumanizeDuration(streamInfo?.streams.youtube.duration as number * 1000)}
									</div>
									{
										currentEmbed.videoId === streamInfo?.streams.youtube.id ?
										<IonButton disabled className={"w-3/5 h-6 text-sm mx-auto roboto"}>
											<div className={"text-xs"}>
												Stream is playing
											</div>
										</IonButton> :
										<IonButton disabled className={"w-3/5 h-6 text-sm mx-auto roboto"}>
											<div className={"text-xs"}>
												View Destiny's Stream
											</div>
										</IonButton>
									}
								</> :
								<>
									<div className={"text-center roboto text-white"}>
										Destiny is <span className={"font-bold text-red-400"}>OFFLINE</span>
									</div>
									<div className={"mx-auto mt-1"}>
										<img src={"https://cdn.destiny.gg/2.60.0/emotes/5c2bbc1b2e160.png"} />
									</div>
									<div className={"text-center roboto text-[8pt] text-[#b9b9b9] mt-1 px-2"}>
										Last stream was on&nbsp;
										{DateTime.fromISO(streamInfo?.streams.youtube.started_at as string).toFormat("EEEE, LLLL d")}&nbsp;
										at&nbsp;
										{DateTime.fromISO(streamInfo?.streams.youtube.started_at as string).toFormat("HH:mm")},&nbsp;
										and lasted&nbsp;
										{HumanizeDuration(streamInfo?.streams.youtube.duration as number * 1000)}
									</div>
									{
										currentEmbed.videoId === (vodsInfo && vodsInfo?.at(0)?.id) ?
										<div className={"flex flex-col mt-2"}>
											<IonButton disabled onTouchEnd={onPlayLatestVod} className={"w-3/5 h-6 text-sm mx-auto roboto"}>
												<div className={"text-xs"}>
													Playing latest vod..
												</div>
											</IonButton>
										</div>	:
										<div className={"flex flex-col mt-2"}>
											<IonButton onTouchEnd={onPlayLatestVod} className={"w-3/5 h-6 text-sm mx-auto roboto"}>
												<div className={"text-xs"}>
													Play latest VOD
												</div>
											</IonButton>
										</div>
									}

								</>
							}
						</div>
						<div className={"flex flex-col mt-auto"}>
							<IonButton onTouchEnd={() => setVodsModalOpen(true)} className={"w-4/5 h8 text-sm mx-auto roboto"}>
								<div className={"text-xs"}>
									Show latest VODs
								</div>
							</IonButton>
							<IonButton onTouchEnd={() => setVideosModalOpen(true)} className={"w-4/5 h8 text-sm mx-auto roboto"}>
								<div className={"text-xs"}>
									Show latest videos
								</div>
							</IonButton>
							<IonButton onTouchEnd={() => setEmbedsModalOpen(true)} className={"w-4/5 h8 text-sm mx-auto roboto"}>
								<div className={"text-xs"}>
									Show recent chat embeds
								</div>
							</IonButton>
						</div>
						<div className={"mt-auto"}>
							<div className={"lobster text-lg text-white my-2 text-center separator"}>
								Chat Tools
							</div>
							<div className={"flex flex-row flex-wrap justify-center"}>
								<IonButton className={"w-1/5 roboto"} onTouchEnd={onUsersButtonPress}>
									<IonIcon className={""} slot={"icon-only"} icon={peopleOutline} />
								</IonButton>
								<IonButton className={"w-1/5 roboto"} onTouchEnd={onEmotesButtonPress}>
									<IonIcon className={""} slot={"icon-only"} icon={happyOutline} />
								</IonButton>
								<IonButton className={"w-1/5 roboto relative"} onTouchEnd={togglePlayer}>
									{
										!playerIsHidden &&
										<IonIcon className={"absolute text-3xl text-red-400"} icon={closeOutline} />
									}
									<IonIcon className={""} slot={"icon-only"} icon={desktopOutline} />
								</IonButton>
							</div>
							{
								user?.team === "YEE" ?
									<div className={"text-center my-1 text-xs text-[#b9b9b9]"}>YEE wins</div> :
								user?.team === "PEPE" ?
									<div className={"text-center my-1 text-xs text-[#b9b9b9]"}>PEPE wins</div> :
								null
							}
						</div>
					</div>
				</IonContent>
			</IonMenu>

			<UsersModal isOpen={usersModalOpen} setOpen={setUsersModalOpen} />
			<EmotesModal isOpen={emotesModalOpen} setOpen={setEmotesModalOpen} />
			<ChatEmbedsModal isOpen={embedsModalOpen} setOpen={setEmbedsModalOpen} />
			<VodsModal isOpen={vodsModalOpen} setOpen={setVodsModalOpen} />
			<VideosModal isOpen={videosModalOpen} setOpen={setVideosModalOpen} />

			<IonAlert
				isOpen={logoutAlertOpen}
				header={"Logout?"}
				buttons={[
					{
						text: "Cancel",
						role: "cancel",
						handler: () => {
							setLogoutAlertOpen(false);
						}
					},
					{
						text: "Yes",
						role: "yes",
						handler: () => {
							setLogoutAlertOpen(false);
							setLogoutLoadingAlertOpen(true)
						}
					},
				]}
				onDidDismiss={() => setLogoutAlertOpen(false)}
				backdropDismiss={true}
			/>

			<IonAlert
				isOpen={logoutLoadingAlertOpen}
				header={"Logging out.."}
				backdropDismiss={false}
				onWillPresent={onLogoutConfirm}
			/>
		</>
    );
}