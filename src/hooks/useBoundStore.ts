import { create, StateCreator } from "zustand";
import { createChatUsersSlice, ChatUsersSlice } from "../slices/ChatUsersSlice";
import { createChatMessagesSlice, ChatMessagesSlice } from "../slices/ChatMessagesSlice";
import { createUserInfoSlice, UserInfoSlice } from "../slices/UserInfoSlice";
import { createStreamInfoSlice, StreamInfoSlice } from "../slices/StreamInfoSlice";
import { createPlayerSlice, PlayerSlice } from "../slices/PlayerSlice";
import { createPollSlice, PollSlice } from "../slices/PollSlice";
import { createPinnedMessageSlice, PinnedMessageSlice } from "../slices/PinnedMessageSlice";
import { createSystemSlice, SystemSlice } from "../slices/SystemSlice";

export type CombinedSlices = ChatUsersSlice & ChatMessagesSlice & UserInfoSlice & StreamInfoSlice & PlayerSlice & PollSlice & PinnedMessageSlice & SystemSlice;

export const useBoundStore = create<CombinedSlices>()((...s) => ({
	...createChatUsersSlice(...s),
	...createChatMessagesSlice(...s),
	...createUserInfoSlice(...s),
	...createStreamInfoSlice(...s),
	...createPlayerSlice(...s),
	...createPollSlice(...s),
	...createPinnedMessageSlice(...s),
	...createSystemSlice(...s)
}));