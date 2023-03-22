import {StateCreator} from "zustand";
import {CombinedSlices} from "../hooks/useBoundStore";
import emotes from "../styles/assets/emotes.json";
import { v4 as uuid } from "uuid";

const emoteNames = emotes.map(x => x.prefix);

export type ChatMessagesSlice = {
    chatMessages: MessageCollection,
	watchingNicks: string[],
	setWatchingNicks: (nicks: string[]) => void,
	addNickToWatch: (nick: string) => void,
	removeNickToWatch: (nick: string) => void,
	comboCount: number,
	setMessages: (messages: MessageCollection) => void,
	addMessage: (message: MessageCollectionItem) => void,
	removeMessage: (message: MessageCollectionItem) => void,
	hideUserMessages: (nick: string) => void,
	showUserMessages: (nick: string) => void
}

export const createChatMessagesSlice: StateCreator<CombinedSlices, [], [], ChatMessagesSlice> = (set) => ({
	chatMessages: [],
	comboCount: 0,
	watchingNicks: [],
	setMessages: (messages) => set((state) => ({ chatMessages: [ ...messages ] })),
	addMessage: (message) => set((state) => {
        const oldMessages = state.chatMessages;
        const lastMessage = oldMessages.at(oldMessages.length - 1);
		const emoteOnlyMessage = isEmoteMessage(message);

        if (emoteOnlyMessage && "data" in message && lastMessage && "data" in lastMessage) {
			if (message.data === lastMessage.data) {
				const oldMessages = state.chatMessages;
                const newComboCount = state.comboCount + 1;
                oldMessages.pop();
                return { chatMessages: [ ...oldMessages, { ...message, comboCount:  newComboCount, isEmoteComboMessage: true, isEmoteComboFinished: false } ], comboCount: newComboCount };
            }
        }

		if (lastMessage && "isEmoteComboMessage" in lastMessage && lastMessage.isEmoteComboMessage) {
			oldMessages.pop();
			oldMessages.push({ ...lastMessage, isEmoteComboFinished: true });
		}

        let isSameNickAsPrevious = false;
        if (lastMessage && "nick" in lastMessage && "nick" in message && lastMessage.nick === message.nick) {
            isSameNickAsPrevious = true;
        }
        
        if (state.chatMessages.length > 200) {
            oldMessages.shift();
            return { chatMessages: [ ...oldMessages, { ...message, isSameNickAsPrevious } ], comboCount: 1 };
        } else {
            return { chatMessages: [ ...oldMessages, { ...message, isSameNickAsPrevious } ], comboCount: 1 };
        }
    }),
	removeMessage: (message) => set((state) => ({ chatMessages: [] })), // YAGNI habit
	hideUserMessages: (nick) => set((state) => ({ chatMessages: state.chatMessages.map((message, index) => {
        if ("nick" in message && nick === message.nick) {
			return {
				...message,
				isHidden: true
			}
		} else {
			return message;
		}})
    })),
	showUserMessages: (nick) => set((state) => ({ chatMessages: state.chatMessages.map((message, index) => {
        if ("nick" in message && nick === message.nick) {
            return {
                ...message,
				isHidden: false
            }
        } else {
            return message;
        }})
    })),
	setWatchingNicks: (nicks) => set(() => ({ watchingNicks: [ ...nicks ] })),
	addNickToWatch: (nick) => set((state) => ({ watchingNicks: [ ...state.watchingNicks, nick ] })),
	removeNickToWatch: (nick) => set((state) => ({ watchingNicks: [ ...state.watchingNicks.filter(x => x !== nick) ] }))
});

const isEmoteMessage = (message: MessageCollectionItem) => {
	if (message && "nick" in message) {
        const messageSplit = message.data.split(" ");
		if (messageSplit.length !== 1) {
            return false;
        } else {
            return !!emotes.some(x => x.prefix === messageSplit[0].trim());
        }
    } else {
        return false;
    }
}