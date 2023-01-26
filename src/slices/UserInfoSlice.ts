import {StateCreator} from "zustand";
import {CombinedSlices} from "../hooks/useBoundStore";

export type UserInfoSlice = {
	user: DggUser | null,
	authToken: string,
	setUser: (newUser: DggUser | null) => void,
	setAuthToken: (token: string) => void
}

export const createUserInfoSlice: StateCreator<CombinedSlices, [], [], UserInfoSlice> = (set) => ({
	user: null,
	authToken: "",
	setUser: (newUser) => set(() => ({ user: newUser })),
	setAuthToken: (token) => set(() => ({ authToken: token }))
});