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

export const LatestVideosQuery = async (): Promise<LiveResponseData<"dggApi:videos">> => {
	const res = await HTTP.sendRequest("https://linode.miaz.xyz/data/videos", {
		method: "get",
		headers: {
			"Authorization": `Basic ${btoa("admin:sohcahtoa")}`
		}
	});
	const parsedVideosInfo = JSON.parse(res.data);
	return parsedVideosInfo.data;
}

export const LatestVodsQuery = async (): Promise<LiveResponseData<"dggApi:youtubeVods">> => {
	const res = await HTTP.sendRequest("https://linode.miaz.xyz/data/youtubevods", {
		method: "get",
		headers: {
			"Authorization": `Basic ${btoa("admin:sohcahtoa")}`
		}
	});
	const parsedVodsInfo = JSON.parse(res.data);
	return parsedVodsInfo.data;
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

export const Last5EmbedsQuery = async (): Promise<Vyneer.Embed[]> => {
	const res = await HTTP.sendRequest("https://vyneer.me/tools/embeds/last", {
		method: "get",

	});
	const parsedEmbedInfo = JSON.parse(res.data);
	return parsedEmbedInfo;
}

export const RecentEmbedsQuery = async (): Promise<Vyneer.Embed[]> => {
	const res = await HTTP.sendRequest("https://vyneer.me/tools/embeds?t=60", {
		method: "get",
	});
	const parsedEmbedInfo = JSON.parse(res.data);
	return parsedEmbedInfo;
}

export const RecentChatQuery = async (): Promise<string[]> => {
	const res = await HTTP.sendRequest("https://destiny.gg/api/chat/history", {
		method: "get",
	});
	return JSON.parse(res.data);
}