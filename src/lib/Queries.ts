import { CapacitorHttp } from "@capacitor/core";

export const UserDataQuery = async (authToken: string): Promise<DggUser> => {
	const res = await CapacitorHttp.get({
		url: "https://www.destiny.gg/api/userinfo?token=" + authToken,
	});
	return res.data;
}

export const StreamInfoQuery = async (): Promise<LiveResponseData<"dggApi:streamInfo">> => {
	const res = await CapacitorHttp.get({
		url: "https://destiny.gg/api/info/stream",
	});
	return res.data.data;
}

export const Last5EmbedsQuery = async (): Promise<Vyneer.Embed[]> => {
	const res = await CapacitorHttp.get({
		url: "https://vyneer.me/tools/embeds/last",
	});
	return res.data;
}

export const RecentEmbedsQuery = async (): Promise<Vyneer.Embed[]> => {
	const res = await CapacitorHttp.get({
		url: "https://vyneer.me/tools/embeds?t=60",
	});
	return res.data;
}

export const RecentChatQuery = async (): Promise<string[]> => {
	const res = await CapacitorHttp.get({
		url: "https://destiny.gg/api/chat/history",
	});
	return res.data;
}