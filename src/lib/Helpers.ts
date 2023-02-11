export function parseChatMessage(input: string): DggPayloadItem {
    try {
        const command = input.split(" ", 1)[0].trim() as ChatMessageCommand;
        const payload = input.replace(command, "").trim();
        return {
            ...JSON.parse(payload),
			command
        };
    } catch (e) {
        console.log("Probably a JSON parse error: ", e);
        console.log(input);
        throw e;
    }
}

export const randomRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) << 0;

const youtubeRegex: RegExp = new RegExp(/^(https:\/\/(www.)?|#)?(youtu(\.)?be)(\.com\/watch\?v=|\/)(.*)/mg);
const twitchRegex: RegExp = new RegExp(/^(https:\/\/(www.)?|#)?(twitch)(\.tv|\/)(.*)/mg);

export const parseEmbedLink = (input: string): EmbedInfo | null => {
	let embedLink = input;
	if (embedLink.startsWith("/bigscreen#")) {
		console.log("slicing");
		embedLink = embedLink.slice(10);
		console.log(embedLink);
	}
	if (embedLink.charAt(0) === "#") {
		const parts = embedLink.slice(1).split("/");
		if (parts.length !== 2) {
			return null;
		}
		return { platform: parts[0] as SupportedPlatforms, videoId: parts[1] };
	}

	if (embedLink.match(youtubeRegex)) {
		const { host, pathname, searchParams } = new URL(embedLink);
		if (host.endsWith(".be")) {
			return { platform: "youtube", videoId: pathname.slice(1) }
		} else {
			return { platform: "youtube", videoId: searchParams.get("v") as string }
		}
	} else if (embedLink.match(twitchRegex)) {
		const { pathname } = new URL(embedLink);
		return { platform: "twitch", videoId: pathname.slice(1) }
	} else {
		return null;
	}
}

export const parseLiveUpdateMessage = (message: string) => {
	const match = message.match(/dggApi:(youtubeVods|videos|hosting|streamInfo)/);
	if (!match) 
		return null;
	
	const responseType = match[0] as LiveResponseType;
	return (JSON.parse(message) as DggLiveResponse<typeof responseType>);
}