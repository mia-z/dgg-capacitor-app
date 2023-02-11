import { useQuery } from "react-query";
import { GetLoginToken, GetUserData } from "../lib/PreferencesHelper";
import { Last5EmbedsQuery, RecentEmbedsQuery, StreamInfoQuery } from "../lib/Queries";
import { useBoundStore } from "./useBoundStore";

export const useInfoQueries = () => {
    const { 
		last5Embeds, setLast5Embeds,
		recentEmbeds, setRecentEmbeds
	} = useBoundStore();
    
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
		recentEmbedsInfo: {
			...recentEmbedsQuery
		},
		last5EmbedsInfo: {
			...last5EmbedsQuery
		}
	}
}