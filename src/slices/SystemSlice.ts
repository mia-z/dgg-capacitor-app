import {StateCreator} from "zustand";
import {CombinedSlices} from "../hooks/useBoundStore";

export type SystemSlice = {
	chatReady: boolean,
    setChatReady: (ready: boolean) => void
}

export const createSystemSlice: StateCreator<CombinedSlices, [], [], SystemSlice> = (set) => ({
	chatReady: false,
    setChatReady: (ready: boolean) => set(() => ({ chatReady: ready }))
});