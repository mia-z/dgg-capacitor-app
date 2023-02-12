import { StateCreator } from "zustand";
import { CombinedSlices } from "../hooks/useBoundStore";

export type ChatUsersSlice = {
    chatUsers: ChatUser[],
	setChatUsers: (users: ChatUser[]) => void,
	addChatUser: (user: ChatUser) => void,
	removeChatUser: (user: ChatUser) => void
}

export const createChatUsersSlice: StateCreator<CombinedSlices, [], [], ChatUsersSlice> = (set) => ({
	chatUsers: [],
	setChatUsers: (users) => set(() => ({ chatUsers: [ ...users ] })),
	addChatUser: (user) => set((state) => ({ chatUsers: [ ...state.chatUsers, user ].sort((a, b) => a.nick.localeCompare(b.nick)) })),
	removeChatUser: (user) => set((state) => ({ chatUsers: [ ...state.chatUsers.filter(x => x.nick !== user.nick) ] }))
});