import {StateCreator} from "zustand";
import {CombinedSlices} from "../hooks/useBoundStore";

export type PollSlice = {
    pollIsActive: boolean,
    poll: PollState | null,
    setPollIsActive: (active: boolean) => void,
    setNewPoll: (poll: PollStartMessage) => void,
    updatePoll: (option: number) => void,
    endPoll: (poll: PollStopMessage) => void,
    removePoll: () => void
}

export const createPollSlice: StateCreator<CombinedSlices, [], [], PollSlice> = (set) => ({
    pollIsActive: false,
    poll: null,
    setPollIsActive: (active: boolean) => set(() => ({ pollIsActive: active })),
    setNewPoll: (poll: PollStartMessage) => set(() => ({ 
        poll: {
            position: "START",
            canVote: poll.canvote,
            duration: poll.time,
            myVote: poll.myvote,
            options: poll.options,
            question: poll.question,
            remaining: poll.time,
            start: poll.start,
            totals: poll.totals,
            totalVotes: poll.totalvotes,
            weighted: poll.weighted,
            author: poll.nick
        }
    })),
    updatePoll: (option: number) => set((state) => { 
        const votes = state.poll?.totals;
        if (votes && state.poll) {
            votes![option-1] += 1;
            return { poll: { ...state.poll, totals: [ ...votes ] } };
        } else return state;
    }),
    endPoll: (poll: PollStopMessage) => set(() => ({ 
        poll: {
            position: "END",
            canVote: poll.canvote,
            duration: poll.time,
            myVote: poll.myvote,
            options: poll.options,
            question: poll.question,
            remaining: 0,
            start: poll.start,
            totals: poll.totals,
            totalVotes: poll.totalvotes,
            weighted: poll.weighted,
            author: poll.nick
        }
    })),
    removePoll: () => set(() => ({ poll: null }))
});