import { useQuery } from "react-query";
import { GetLoginToken, GetUserData } from "../lib/PreferencesHelper";
import { useBoundStore } from "./useBoundStore";

export const usePreferenceQueries = () => {
	const { authToken, setAuthToken, user, setUser } = useBoundStore();

	const tokenPreferencesQuery = useQuery({
		queryKey: ["authToken", authToken],
		queryFn: async () => await GetLoginToken(),
		onSuccess: (result) => {
			if (result) {
				setAuthToken(result);
			} else {
				console.log("local authToken not found");
			}
		},
		refetchInterval: false
	});

	const userDataPreferencesQuery = useQuery({
		queryKey: ["userData", user],
		queryFn: async () => await GetUserData(),
		onSuccess: (result) => {
			if (result) {
				setUser(result);
			} else {
				console.log("local userData not found");
			}
		},
		refetchInterval: false
	});

	return {
		userData: {
			...userDataPreferencesQuery
		},
		token: {
			...tokenPreferencesQuery
		}
	}
}