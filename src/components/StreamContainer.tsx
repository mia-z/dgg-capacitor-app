import React, { FC, useContext, useEffect, useState } from "react";
import YouTube, { YouTubeProps} from "react-youtube";
import {useQuery} from "react-query";
import {useBoundStore} from "../hooks/useBoundStore";
import {HostInfoQuery, StreamInfoQuery} from "../lib/Queries";
import {parseEmbedLink} from "../lib/Helpers";
import { useInfoQueries } from "../hooks/useInfoQueries";

type StreamContainerProps = {
    height: number,
	width: number
}

export const StreamContainer: FC<StreamContainerProps> = ({ height, width }) => {
	const { streamInfo, setCurrentEmbed, usingCustomEmbed, currentEmbed, playerIsHidden } = useBoundStore();

	const queries = useInfoQueries();

	useEffect(() => {
		if (!usingCustomEmbed) {
			setCurrentEmbed({ platform: "youtube", videoId: streamInfo?.streams.youtube.id as string });
		}
	}, [streamInfo, usingCustomEmbed]);

    const playerOpts: YouTubeProps["opts"] = {
		width: "100%",
		height: (9/16) * width
    };

	return (
		<div className={"transition-all"} style={{ width: "100%", height: playerIsHidden ? 0 : (9/16) * width }}>
			<YouTube videoId={currentEmbed.videoId} opts={playerOpts} />
        </div>
    );
}