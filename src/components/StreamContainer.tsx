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
				<div className={"transition-all"} style={{ width: "100%", height: playerIsHidden ? 0 : (9/16) * width }}>
					<YouTube videoId={currentEmbed.videoId} opts={playerDimensions} />
				</div>
			);
		}
		case "twitch": {
			return (
				<div className={"transition-all flex flex-col"} style={{ width: "100%", height: playerIsHidden ? 0 : (9/16) * width }}>
					<TwitchPlayer channel={currentEmbed.videoId} height={playerDimensions.height} width={playerDimensions.width} />
				</div>
			)
		}
		case "rumble": {
			return (
				<div className={"transition-all"} style={{ width: "100%", height: playerIsHidden ? 0 : (9/16) * width }}>
					<iframe src={`https://rumble.com/embed/${currentEmbed.videoId}`} {...playerDimensions} />
				</div>
			)
		}
		default: return <div></div> //TODO: Improve this somewhat
	}
}