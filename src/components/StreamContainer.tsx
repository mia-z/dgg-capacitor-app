import React, { FC, useContext, useEffect, useState } from "react";
import YouTube, { YouTubeProps} from "react-youtube";
import {useQuery} from "react-query";
import {useBoundStore} from "../hooks/useBoundStore";
import {HostInfoQuery, StreamInfoQuery} from "../lib/Queries";
import {parseEmbedLink} from "../lib/Helpers";


type StreamContainerProps = {
    height: number,
	width: number
}

export const StreamContainer: FC<StreamContainerProps> = ({ height, width }) => {
	const { streamInfo, setStreamInfo, hostInfo, setHostInfo, setCurrentEmbed, usingCustomEmbed, currentEmbed, playerIsHidden } = useBoundStore();

	useEffect(() => {
		if (!usingCustomEmbed) {
			setCurrentEmbed({ platform: "youtube", videoId: streamInfo?.streams.youtube.id as string });
		}
	}, [streamInfo, usingCustomEmbed]);

	const streamInfoQuery = useQuery({
		queryKey: ["streamInfo", streamInfo],
		queryFn: async () => await StreamInfoQuery(),
		onSuccess: (result) => {
			if (result) {
				setStreamInfo(result);
			}
		},
		refetchInterval: 1000 * 60
	});

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