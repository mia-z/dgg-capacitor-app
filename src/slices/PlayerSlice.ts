import {StateCreator} from "zustand";
import {CombinedSlices} from "../hooks/useBoundStore";

export type PlayerSlice = {
	currentEmbed: EmbedInfo,
	playerIsHidden: boolean,
	usingCustomEmbed: boolean,
	setCurrentEmbed: (embedInfo: EmbedInfo) => void,
	hidePlayer: () => void,
	showPlayer: () => void,
	togglePlayer: () => void,
	setPlayerHidden: (hidden: boolean) => void,
	setUsingCustomEmbed: (value: boolean) => void
}

export const createPlayerSlice: StateCreator<CombinedSlices, [], [], PlayerSlice> = (set) => ({
	currentEmbed: { platform: "youtube", videoId: "" },
	playerIsHidden: false,
	usingCustomEmbed: false,
	setCurrentEmbed: (embedInfo: EmbedInfo) => set(() => ({ currentEmbed: embedInfo })),
	hidePlayer: () =>  set(() => ({ playerIsHidden: true })),
	showPlayer: () => set(() => ({ playerIsHidden: false })),
	togglePlayer: () => set((state) => ({ playerIsHidden: !state.playerIsHidden })),
	setPlayerHidden: (hidden: boolean) => set(() => ({ playerIsHidden: hidden })),
	setUsingCustomEmbed: (value: boolean) => set(() => ({ usingCustomEmbed: value }))
});