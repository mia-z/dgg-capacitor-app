import { StateCreator } from "zustand";
import { CombinedSlices } from "../hooks/useBoundStore";

export type StreamInfoSlice = {
	streamInfo: StreamInfo | undefined,
	setStreamInfo: (info: StreamInfo) => void,
	vodsInfo: VodsInfo | undefined,
	setVodsInfo: (info: VodsInfo) => void,
	videosInfo: VideosInfo | undefined,
	setVideosInfo: (info: VideosInfo) => void,
	hostInfo: HostInfo | undefined,
	setHostInfo: (info: HostInfo) => void,
	last5Embeds: Vyneer.Embed[],
	setLast5Embeds: (embeds: Vyneer.Embed[]) => void,
	recentEmbeds: Vyneer.Embed[],
	setRecentEmbeds: (embeds: Vyneer.Embed[]) => void,
}

export const createStreamInfoSlice: StateCreator<CombinedSlices, [], [], StreamInfoSlice> = (set) => ({
	streamInfo: undefined,
	setStreamInfo: (info: StreamInfo) => set(() => ({ streamInfo: info })),
	vodsInfo: undefined,
	setVodsInfo: (info: VodsInfo) => set(() => ({ vodsInfo: info })),
	videosInfo: undefined,
	setVideosInfo: (info: VideosInfo) => set(() => ({ videosInfo: info })),
	hostInfo: undefined,
	setHostInfo: (info: HostInfo) => set(() => ({ hostInfo: info })),
	last5Embeds: [],
	setLast5Embeds: (embeds: Vyneer.Embed[]) => set(() => ({ last5Embeds: embeds })),
	recentEmbeds: [],
	setRecentEmbeds: (embeds: Vyneer.Embed[]) => set(() => ({ recentEmbeds: embeds }))
});