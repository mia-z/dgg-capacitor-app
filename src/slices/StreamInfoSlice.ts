import {StateCreator} from "zustand";
import {CombinedSlices} from "../hooks/useBoundStore";

export type StreamInfoSlice = {
	streamInfo: StreamInfo | undefined,
	setStreamInfo: (info: StreamInfo) => void
}

export const createStreamInfoSlice: StateCreator<CombinedSlices, [], [], StreamInfoSlice> = (set) => ({
	streamInfo: undefined,
	//setStreamInfo: (info: StreamInfo) => set(() => ({ streamInfo: { ...info, streams: { ...info.streams,  youtube: { ...info.streams.youtube, live: true } } } }))
	setStreamInfo: (info: StreamInfo) => set(() => ({ streamInfo: info }))
});