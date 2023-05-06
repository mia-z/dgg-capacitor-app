import React, { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { IonAlert, IonButton, IonContent, IonIcon, IonMenu, useIonAlert, useIonRouter } from "@ionic/react";
import { peopleOutline, desktopOutline, happyOutline, closeOutline, settingsSharp, logOutOutline } from "ionicons/icons";
import { UserListActionSheet } from "./modals/UserListActionSheet";
import { EmoteListActionSheet } from "./modals/EmoteListActionSheet";
import { useBoundStore } from "../hooks/useBoundStore";
import { DggAssets } from "../hooks/DggAssetContext";
import { DateTime } from "luxon";
import HumanizeDuration from "humanize-duration";
import { ClearUserData } from "../lib/PreferencesHelper";
import { ChatEmbedsActionSheet } from "./modals/ChatEmbedsActionSheet";
import { VodsActionSheet } from "./modals/VodsActionSheet";
import { VideosActionSheet } from "./modals/VideosActionSheet";
import { parseEmbedLink } from "../lib/Helpers";
import { App } from "@capacitor/app";
import { KickLogoIcon, RumbleLogoIcon, TwitchLogoIcon, YoutubeLogoIcon } from "./../Images";

const memePhrases = [
	"YEE wins",
	"PEPE wins",
	"For me, personally..",
	"Hey buddy you wanna hop on discord and chat about it? :)",
	"Off the penjamin",
	"Gotcha, anything else?"
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

const noDestinyStreamError = {
	header: "Couldnt play Destiny stream",
	subHeader: "Couldnt play Destiny's youtube stream - tell miaz in DGG if you see this error (you shouldnt ever see it!)",
	buttons: ["Ok"]
}

export const ChatMenu: FC<ChatMenuProps> = ({ }) => {
	const sideMenuRef = useRef<HTMLIonMenuElement>(null);

	const router = useIonRouter();

	const [ver, setVer] = useState<string>("");

	const [presentAlert] = useIonAlert();

	const { user, streamInfo, currentEmbed, togglePlayer, playerIsHidden, setUser, setAuthToken, setCurrentEmbed, platform, setUsingCustomEmbed, vodsInfo, pinnedMessage } = useBoundStore();

	const { emotes, flairs } = useContext(DggAssets);

	const [logoutAlertOpen, setLogoutAlertOpen] = useState<boolean>(false);
	const [logoutLoadingAlertOpen, setLogoutLoadingAlertOpen] = useState<boolean>(false);

	const flairsToUse = flairs?.filter((flair, index) => {
		if (!user?.features || user.features.length < 1) {
			return [];
		} else {
			return user?.features.includes(flair.name);
		}
	});

	const pinnedUserFlairsToUse = flairs?.filter((flair, index) => {
		if (!pinnedMessage || !pinnedMessage.user.features || pinnedMessage.user.features.length < 1) {
			return [];
		} else {
			return pinnedMessage.user.features.includes(flair.name);
		}
	})

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

	const onStreamSourceClick = useCallback((platform: SupportedPlatforms) => {
		switch (platform) {
			case "youtube": {
				if (streamInfo?.streams.youtube && streamInfo.streams.youtube.live) {
					setCurrentEmbed({ platform: "youtube", videoId: streamInfo.streams.youtube.id, isDestiny: true });
				}
				break;
			}
			case "kick": {
				if (streamInfo?.streams.kick && streamInfo.streams.kick.live) {
					setCurrentEmbed({ platform: "kick", videoId: streamInfo.streams.kick.id, isDestiny: true });
				}
				break;
			}
			case "rumble": {
				if (streamInfo?.streams.rumble && streamInfo.streams.rumble.live) {
					setCurrentEmbed({ platform: "rumble", videoId: streamInfo.streams.rumble.id, isDestiny: true });
				}
				break;
			}
			case "twitch": {
				if (streamInfo?.streams.twitch && streamInfo.streams.twitch.live) {
					setCurrentEmbed({ platform: "twitch", videoId: streamInfo.streams.twitch.id, isDestiny: true });
				}
				break;
			}
		}
	}, [streamInfo]);

	useEffect(() => {
		(async () => {
			const v = await App.getInfo();
			setVer(v.version);
		})();
	}, []);

	return (
		<>
			<IonMenu ref={sideMenuRef} id={"side-menu"} menuId={"side-menu"} contentId={"bigscreen-content"}>
				<IonContent>
					<div className={"bg-base-300 h-full w-full flex flex-col relative"}>
						<IonIcon onTouchEnd={() => presentAlert(notImplementedAlertProps)} className={"absolute left-5 top-7 text-white h-6 w-6 active:text-blue-400 transition-all"} icon={settingsSharp} />
						<IonIcon onTouchEnd={() => setLogoutAlertOpen(true)} className={"absolute right-5 top-7 text-white h-6 w-6 active:text-blue-400 transition-all"} icon={logOutOutline} />
						<div className={"lobster text-3xl text-white my-5 text-center text-shadow-lg"}>
							Appstiny
						</div>
						<div id={"user-card"} className={`m-3 mt-auto relative grid grid-cols-3 bg-base-100 grid-rows-1 text-sm rounded-md shadow-lg ${user?.team === "YEE" ? "yee" : user?.team === "PEPE" ? "pepe" : ""}`}>
							<div className={"col-span-1"}>
								<div className={`flex shadow-xl flex-col bg-base-100 text-sm h-20 p-2 m-3 rounded relative`}>
									{
										user?.team === "YEE" ?
											<img className={"m-auto h-8 w-8"} src={"https://cdn.destiny.gg/2.60.0/emotes/5c2bbe330b357.png"} /> :
										user?.team === "PEPE" ?
											<img className={"m-auto h-8 w-8"} src={"https://cdn.destiny.gg/2.60.0/emotes/6157386b7d2fc.png"} /> :
										<div className={"text-white text-xs text-center"}>No team!</div>
									}
								</div>
							</div>
							<div className={"col-span-2 flex flex-col pr-2"}>
								<div className={"my-auto flex flex-col"}>
									<div className={"text-center text-white user font-bold " + flairsToUse?.map(x => x.name).reverse().join(" ")} >
										{user?.nick}
									</div>
									<hr className={"divider my-2 border-none h-[1px] bg-neutral-content"} />
									<div className={"flex flex-row text-sm flex-wrap justify-center"}>
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
							</div>
							<div className={"col-start-1 col-span-3 flex roboto text-xs flex-row justify-around my-auto text-neutral-content"}>
								<div className={"ml-auto mr-1"}>
									Member since:
								</div>
								<div className={"mr-auto ml-1"}>
									{DateTime.fromISO(user?.createdDate!).toFormat("yyyy/MM/dd")}
								</div>
							</div>
						</div>
						<div className={"bg-base-100 rounded-md shadow-xl m-3 mb-auto p-2"}>
							<div className={"flex flex-col"}>
								{
									(streamInfo?.streams.youtube && streamInfo?.streams.youtube.live) || 
										(streamInfo?.streams.kick && streamInfo?.streams.kick.live) || 
										(streamInfo?.streams.rumble && streamInfo?.streams.rumble.live) || 
										(streamInfo?.streams.twitch && streamInfo?.streams.twitch.live) ?
									<>
										<div className={"text-center roboto text-white"}>
											Destiny is <span className={"font-bold text-emerald-400"}>LIVE</span>
										</div>
										<div className={"mx-auto mt-1"}>
											<img src={"https://cdn.destiny.gg/2.60.0/emotes/5c2bbb9fa8ab2.png"} />
										</div>
									</> :
									<div className={"flex flex-row justify-center"}>
										<div className={"text-center roboto my-auto text-white"}>
											Destiny is <span className={"font-bold text-red-400"}>OFFLINE</span>
										</div>
										<div className={"ml-1"}>
											<img src={"https://cdn.destiny.gg/2.60.0/emotes/5c2bbc1b2e160.png"} />
										</div>
									</div>
								}
							</div>
							<div className={"flex flex-row h-14 mt-5 justify-center space-x-2"}>
								<div onClick={() => onStreamSourceClick("twitch")} className={`twitch-live-icon h-10 w-10 flex  ${(currentEmbed?.platform === "twitch" && currentEmbed?.isDestiny) ? "bg-blue-400" : "bg-white"} rounded-full p-2 ${streamInfo?.streams.twitch && streamInfo.streams.twitch.live ? "opacity-100" : "opacity-30 grayscale"}`}>
									<img className={"h-full"} src={TwitchLogoIcon} />
								</div>
								<div onClick={() => onStreamSourceClick("youtube")} className={`youtube-live-icon h-10 w-10 flex  ${(currentEmbed?.platform === "youtube" && currentEmbed?.isDestiny) ? "bg-blue-400" : "bg-white"} rounded-full p-2 ${streamInfo?.streams.youtube && streamInfo.streams.youtube.live ? "opacity-100" : "opacity-30 grayscale"}`}>
									<img className={"w-full my-auto"} src={YoutubeLogoIcon} />
								</div>
								<div onClick={() => onStreamSourceClick("rumble")} className={`rumble-live-icon h-10 w-10 flex  ${(currentEmbed?.platform === "rumble" && currentEmbed?.isDestiny) ? "bg-blue-400" : "bg-white"} rounded-full p-2 ${streamInfo?.streams.rumble && streamInfo.streams.rumble.live ? "opacity-100" : "opacity-30 grayscale"}`}>
									<img className={"h-full mx-auto"} src={RumbleLogoIcon} />
								</div>
								<div onClick={() => onStreamSourceClick("kick")} className={`kick-live-icon h-10 w-10 flex  ${(currentEmbed?.platform === "kick" && currentEmbed?.isDestiny) ? "bg-blue-400" : "bg-white"} rounded-full p-2 ${streamInfo?.streams.kick && streamInfo.streams.kick.live ? "opacity-100" : "opacity-30 grayscale"}`}>
									<img className={"h-full mx-auto"} src={KickLogoIcon} />
								</div>
							</div>
							<hr className={"divider my-2 border-none h-[1px] bg-neutral-content opacity-50 mb-5"} />
							<div className={"flex flex-col mt-auto"}>
								<IonButton onTouchEnd={() => setVodsModalOpen(true)} className={"w-4/5 h8 text-sm mx-auto roboto shadow-xl"}>
									<div className={"text-xs"}>
										Latest VODs
									</div>
								</IonButton>
								<IonButton onTouchEnd={() => setVideosModalOpen(true)} className={"w-4/5 h8 text-sm mx-auto roboto shadow-xl"}>
									<div className={"text-xs"}>
										Latest videos
									</div>
								</IonButton>
								<IonButton onTouchEnd={() => setEmbedsModalOpen(true)} className={"w-4/5 h8 text-sm mx-auto roboto shadow-xl"}>
									<div className={"text-xs"}>
										Recent chat embeds
									</div>
								</IonButton>
							</div>
						</div>
						<div className={"mt-auto"}>
							{
								pinnedMessage &&
								<div className={"flex flex-col relative p-1 bg-slate-800 shadow-md mx-2 rounded-lg"}>
									<div className={"lobster text-white text-center"}>Pinned Message</div>
									<div className={"text-[#dedede] text-xs mb-2 text-center"}>
										<span className={"text-white user " + pinnedUserFlairsToUse?.map(x => x.name).reverse().join(" ")}>{pinnedMessage.user.nick}</span>:&nbsp;{pinnedMessage.data}
									</div>
									<img className={"absolute -top-4 right-1"} src={"https://cdn.destiny.gg/2.60.0/emotes/6296cf7e8ccd0.png"} />
								</div>
							}
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
							<div className={"grid grid-cols-3"}>
								<div className={"col-start-2"}>
									{
										user?.team === "YEE" ?
											<div className={"text-center my-1 text-xs text-[#b9b9b9]"}>YEE wins</div> :
										user?.team === "PEPE" ?
											<div className={"text-center my-1 text-xs text-[#b9b9b9]"}>PEPE wins</div> :
										null
									}
								</div>
								<div className={"col-start-3 text-right mr-1 text-xs my-auto text-[#b9b9b9]"}>
									{platform}-v{ver}
								</div>
							</div>
						</div>
					</div>
				</IonContent>
			</IonMenu>

			<UserListActionSheet isOpen={usersModalOpen} setOpen={setUsersModalOpen} />
			<EmoteListActionSheet isOpen={emotesModalOpen} setOpen={setEmotesModalOpen} />
			<ChatEmbedsActionSheet isOpen={embedsModalOpen} setOpen={setEmbedsModalOpen} />
			<VodsActionSheet isOpen={vodsModalOpen} setOpen={setVodsModalOpen} />
			<VideosActionSheet isOpen={videosModalOpen} setOpen={setVideosModalOpen} />

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