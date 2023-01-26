import { create, StateCreator } from "zustand";
import { createChatUsersSlice, ChatUsersSlice } from "../slices/ChatUsersSlice";
import { createChatMessagesSlice, ChatMessagesSlice } from "../slices/ChatMessagesSlice";
import { createUserInfoSlice, UserInfoSlice } from "../slices/UserInfoSlice";
import { createStreamInfoSlice, StreamInfoSlice } from "../slices/StreamInfoSlice";
import { createHostInfoSlice, HostInfoSlice } from "../slices/HostInfoSlice";
import { createPlayerSlice, PlayerSlice } from "../slices/PlayerSlice";

export type CombinedSlices = ChatUsersSlice & ChatMessagesSlice & UserInfoSlice & HostInfoSlice & StreamInfoSlice & PlayerSlice;

export const useBoundStore = create<CombinedSlices>()((...s) => ({
	...createChatUsersSlice(...s),
	...createChatMessagesSlice(...s),
	...createUserInfoSlice(...s),
	...createStreamInfoSlice(...s),
	...createHostInfoSlice(...s),
	...createPlayerSlice(...s)
}));