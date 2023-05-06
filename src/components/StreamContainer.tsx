import React, { FC, useContext, useEffect, useState } from "react";
import YouTube, { YouTubeProps} from "react-youtube";
import {useBoundStore} from "../hooks/useBoundStore";
import { useInfoQueries } from "../hooks/useInfoQueries";
import { TwitchPlayer } from "react-twitch-embed";
import { useIonAlert } from "@ionic/react";

type StreamContainerProps = {
    height: number,
	width: number
}

const notSupportedTwitchEmbedAlertProps = {
	header: "Unsupported",
	subHeader: "Twitch is currently not supported on iOS (Blame Twitch)",
	buttons: ["Ok"]
}

export const StreamContainer: FC<StreamContainerProps> = ({ height, width }) => {
	const playerDimensions = {
		width: "100%",
		height: (9/16) * width
	}
	
	const [presentAlert] = useIonAlert();

	const { streamInfo, setCurrentEmbed, usingCustomEmbed, currentEmbed, playerIsHidden, platform } = useBoundStore();

	const queries = useInfoQueries();

	useEffect(() => {
		if (!usingCustomEmbed && !currentEmbed) {
			if (streamInfo?.streams.kick) {
				setCurrentEmbed({ platform: "kick", videoId: streamInfo.streams.kick.id, isDestiny: true });
			}
			if (streamInfo?.streams.rumble) {
				setCurrentEmbed({ platform: "rumble", videoId: streamInfo.streams.rumble.id, isDestiny: true });
			}
			if (streamInfo?.streams.twitch) {
				if (platform === "ios") {
					presentAlert(notSupportedTwitchEmbedAlertProps);
				} else {
					setCurrentEmbed({ platform: "twitch", videoId: streamInfo.streams.twitch.id, isDestiny: true });
				}
			}
			if (streamInfo?.streams.youtube && streamInfo.streams.youtube.live) {
				setCurrentEmbed({ platform: "youtube", videoId: streamInfo.streams.youtube.id, isDestiny: true });
			}
		}
	}, [streamInfo, currentEmbed, usingCustomEmbed]);

	switch (currentEmbed?.platform) {
		case "youtube": {		
			return (
				<div className={`transition-all absolute w-full left-0 z-10 ${playerIsHidden ? "-top-[50%]" : "top-0"}`}>
					<YouTube videoId={currentEmbed.videoId} opts={playerDimensions} />
				</div>
			);
		}
		case "twitch": {
			return (
				<div className={`transition-all flex flex-col absolute w-full left-0 z-10 ${playerIsHidden ? "-top-[50%]" : "top-0"}`}>
					<TwitchPlayer channel={currentEmbed.videoId} { ...playerDimensions }/>
				</div>
			)
		}
		case "rumble": {
			return (
				<div className={`transition-all absolute w-full left-0 z-10 ${playerIsHidden ? "-top-[50%]" : "top-0"}`}>
					<iframe src={`https://rumble.com/embed/${currentEmbed.videoId}`} {...playerDimensions} />
				</div>
			)
		}
		case "kick": {
			return (
				<div className={`transition-all absolute w-full left-0 z-10 ${playerIsHidden ? "-top-[50%]" : "top-0"}`}>
					<video { ...playerDimensions } controls autoPlay playsInline>
						<source src={currentEmbed.videoId} type="application/x-mpegURL" />
					</video>
				</div>
			)
		}
		default: return null; //TODO: Improve this somewhat
	}
}