import { useQuery } from "react-query";
import { GetLoginToken, GetUserData } from "../lib/PreferencesHelper";
import { Last5EmbedsQuery, LatestVideosQuery, LatestVodsQuery, RecentEmbedsQuery, StreamInfoQuery } from "../lib/Queries";
import { useBoundStore } from "./useBoundStore";

export const useInfoQueries = () => {
    const { 
		streamInfo, setStreamInfo, 
		videosInfo, setVideosInfo, 
		vodsInfo, setVodsInfo,
		last5Embeds, setLast5Embeds,
		recentEmbeds, setRecentEmbeds
	} = useBoundStore();
    
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

    const vodsInfoQuery = useQuery({
		queryKey: ["vodsInfo", vodsInfo],
		queryFn: async () => await LatestVodsQuery(),
		onSuccess: (result) => {
			if (result) {
				setVodsInfo(result);
			}
		},
		refetchInterval: 1000 * 60
	});

    const videosInfoQuery = useQuery({
		queryKey: ["videosInfo", videosInfo],
		queryFn: async () => await LatestVideosQuery(),
		onSuccess: (result) => {
			if (result) {
				setVideosInfo(result);
			}
		},
		refetchInterval: 1000 * 60
	});

	const last5EmbedsQuery = useQuery({
		queryKey: ["last5Embeds", last5Embeds],
		queryFn: async () => await Last5EmbedsQuery(),
		onSuccess: (result) => {
			if (result) {
				setLast5Embeds(result);
			}
		},
		refetchInterval: 1000 * 60
	});

	const recentEmbedsQuery = useQuery({
		queryKey: ["recentEmbeds", recentEmbeds],
		queryFn: async () => await RecentEmbedsQuery(),
		onSuccess: (result) => {
			if (result) {
				setRecentEmbeds(result);
			}
		},
		refetchInterval: 1000 * 60
	});

	return {
		streamInfo: {
			...streamInfoQuery
		},
		videosInfo: {
			...videosInfoQuery
		},
        vodsInfo: {
			...vodsInfoQuery
		},
		recentEmbedsInfo: {
			...recentEmbedsQuery
		},
		last5EmbedsInfo: {
			...last5EmbedsQuery
		}
	}
}