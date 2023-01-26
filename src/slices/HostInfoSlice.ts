import {StateCreator} from "zustand";
import {CombinedSlices} from "../hooks/useBoundStore";

export type HostInfoSlice = {
	hostInfo: HostInfo | undefined,
	setHostInfo: (info: HostInfo) => void,
}

export const createHostInfoSlice: StateCreator<CombinedSlices, [], [], HostInfoSlice> = (set) => ({
	hostInfo: undefined,
	setHostInfo: (info: HostInfo) => set(() => ({ hostInfo: info }))
});