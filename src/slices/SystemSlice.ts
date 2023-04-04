import {StateCreator} from "zustand";
import {CombinedSlices} from "../hooks/useBoundStore";
import { Capacitor } from "@capacitor/core";

export type SystemSlice = {
	chatReady: boolean,
    setChatReady: (ready: boolean) => void,
    platform: string
}

export const createSystemSlice: StateCreator<CombinedSlices, [], [], SystemSlice> = (set) => ({
	chatReady: false,
    setChatReady: (ready: boolean) => set(() => ({ chatReady: ready })),
    platform: Capacitor.getPlatform()
});