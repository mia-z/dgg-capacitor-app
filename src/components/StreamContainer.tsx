import React, { FC, useContext, useEffect, useState } from "react";
import YouTube, { YouTubeProps} from "react-youtube";
import {useBoundStore} from "../hooks/useBoundStore";
import { useInfoQueries } from "../hooks/useInfoQueries";
import { TwitchPlayer } from "react-twitch-embed";

type StreamContainerProps = {
    height: number,
	width: number
}

export const StreamContainer: FC<StreamContainerProps> = ({ height, width }) => {
	const playerDimensions = {
		width: "100%",
		height: (9/16) * width
	}
	
	const { streamInfo, setCurrentEmbed, usingCustomEmbed, currentEmbed, playerIsHidden } = useBoundStore();

	const queries = useInfoQueries();

	useEffect(() => {
		if (!usingCustomEmbed) {
			setCurrentEmbed({ platform: "youtube", videoId: streamInfo?.streams.youtube.id as string });
		}
	}, [streamInfo, usingCustomEmbed]);

	switch (currentEmbed.platform) {
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
					<TwitchPlayer channel={currentEmbed.videoId} height={playerDimensions.height} width={playerDimensions.width} />
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
		default: return <div></div> //TODO: Improve this somewhat
	}
}