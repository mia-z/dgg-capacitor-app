import axios from "axios";
import { HTTP } from "@awesome-cordova-plugins/http";

export const UserDataQuery = async (authToken: string): Promise<DggUser> => {
	const res = await HTTP.sendRequest("https://www.destiny.gg/api/userinfo?token=" + authToken, {
		method: "get",
	});
	return JSON.parse(res.data);
}

export const StreamInfoQuery = async (): Promise<LiveResponseData<"dggApi:streamInfo">> => {
	// const res = await HTTP.sendRequest("https://linode.miaz.xyz/data/streaminfo", {
	// 	method: "get",
	// 	headers: {
	// 		"Authorization": `Basic ${btoa("admin:sohcahtoa")}`
	// 	}
	// });
	const res = await HTTP.sendRequest("https://destiny.gg/api/info/stream", {
		method: "get",
	});
	const parsedStreamInfo = JSON.parse(res.data);
	return parsedStreamInfo.data;
}

export const HostInfoQuery = async (): Promise<LiveResponseData<"dggApi:hosting">> => {
	const res = await HTTP.sendRequest("https://linode.miaz.xyz/data/hosting", {
		method: "get",
		headers: {
			"Authorization": `Basic ${btoa("admin:sohcahtoa")}`
		}
	});
	const parsedhostInfo = JSON.parse(res.data);
	return parsedhostInfo.data;
}

export const Last5Embeds = async (): Promise<Vyneer.Embed[]> => {
	const res = await HTTP.sendRequest("https://vyneer.me/tools/embeds/last", {
		method: "get",

	});
	const parsedEmbedInfo = JSON.parse(res.data);
	return parsedEmbedInfo.data;
}

export const RecentEmbeds = async (): Promise<Vyneer.Embed[]> => {
	const res = await HTTP.sendRequest("https://vyneer.me/tools/embeds?t=60", {
		method: "get",
	});
	const parsedEmbedInfo = JSON.parse(res.data);
	return parsedEmbedInfo.data;
}

export const RecentChatQuery = async (): Promise<string[]> => {
	const res = await HTTP.sendRequest("https://destiny.gg/api/chat/history", {
		method: "get",
	});
	return JSON.parse(res.data);
}