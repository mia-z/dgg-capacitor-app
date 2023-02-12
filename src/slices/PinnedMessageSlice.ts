import {StateCreator} from "zustand";
import {CombinedSlices} from "../hooks/useBoundStore";

export type PinnedMessageSlice = {
    pinnedMessage: PinnedMessage | null
	setPinnedMessage: (message: PinMessage) => void
}

export const createPinnedMessageSlice: StateCreator<CombinedSlices, [], [], PinnedMessageSlice> = (set) => ({
	pinnedMessage: null,
	setPinnedMessage: (message) => set(() => ({ 
		pinnedMessage: {
			user: {
				nick: message.nick,
				features: message.features
			},
			createdDate: message.createdDate,
			data: message.data,
			timestamp: message.timestamp,
			uuid: message.uuid
		}
	})),
});