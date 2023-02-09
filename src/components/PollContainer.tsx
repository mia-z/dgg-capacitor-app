import { DateTime } from "luxon";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import { setInterval } from "timers/promises";
import { useBoundStore } from "../hooks/useBoundStore";
import { PollTimer } from "./PollTimer";

type PollContainerProps = {
    width: number,
    height: number
}

export const PollContainer: FC<PollContainerProps> = ({ width, height }) => {
    const { playerIsHidden, pollIsActive, poll, setNewPoll, setPollIsActive, endPoll, updatePoll } = useBoundStore();

    const [top, setTop] = useState<number>(0);
    const [containerHeight, setContainerHeight] = useState<number>(0);
    const [winner, setWinner] = useState<{ option: string, votes: number }| null>(null)

    useEffect(() => {
        if (playerIsHidden) {
            setTop(0);
        } else {
            const height = (9/16) * width;
            setTop(height);
        }
    }, [playerIsHidden]);

    useEffect(() => {
        if (pollIsActive && poll) {
            setContainerHeight((poll.options.length * 2) + 9);
        } else if (poll && !pollIsActive) {
            setContainerHeight(0);
        }
    }, [poll, pollIsActive]);

    useEffect(() => {
        if (poll && poll.position === "END") {
            const winningVotes = Math.max(...poll.totals);
            const winningValue = poll.options.at(poll.totals.indexOf(winningVotes));
            setWinner({ option: winningValue!, votes: winningVotes });
            setTimeout(() => {
                setPollIsActive(false);
                setWinner(null);
            }, 5000);
        }
    }, [poll]);

    return (
        <div style={{ top, height: `${containerHeight}rem` }} className={`absolute transition-all left-[2px] z-50 w-[calc(100%-6px)] ${pollIsActive ? "opacity-100" : "opacity-0"} bg-black rounded-b-lg border-x-[1px] border-b-[1px] border-blue-400 flex flex-col roboto`}>
            <div className={"h-[5rem] mt-2 flex"}>
                <div className={"text-center m-auto"}>
                    <span className={"text-white text-sm font-bold underline"}>New poll</span>&nbsp;<span className={"text-white text-sm"}>- started by: {poll?.author}</span>
                    <br /> 
                    <span className={"text-[#dedede] text-xs"}>{poll?.question}</span>
                </div>
            </div>
            <div className={"flex flex-col"}>
                {
                    poll?.options.map((option, index, array) => {
                        const total = poll.totals.reduce((curr, next) => curr + next, 0);
                        const widthPercent = poll.totals[index] === 0 ? 0 : Math.floor((poll.totals[index] / total) * 100);
                        const isWinner = winner && winner.option === option;
                        return (
                            <div key={`option-${option}-${index}`} className={`flex flex-row text-white h-[2rem] px-2 ${(winner && isWinner ? "opacity-100" : (winner && !isWinner ? "opacity-50" : "opacity-100"))}`}>
                                <div className={"w-1/12 my-auto bg-light-black rounded-xl m-1 text-center"}>
                                    {index}
                                </div>
                                <div className={"w-11/12 my-auto h-full flex relative"}>
                                    <div className={"border-[1px] border-blue-400 rounded-2xl bg-light-black flex flex-row justify-between w-full my-auto px-2 h-6"}>
                                        <div className={"z-50 text-xs my-auto"}>
                                            {option}
                                        </div>
                                        <div className={"z-50 text-xs my-auto"}>
                                        ({poll.totals[index]})&nbsp;{widthPercent}%
                                        </div>
                                    </div>
                                    <div style={{ width: `${widthPercent}%`, opacity: poll.totals[index] === 0 ? 0 : 1 }} className={`absolute h-[22px] left-[1px] top-[5px] transition-all border-[1px] border-transparent rounded-2xl ${(winner && isWinner ? "bg-green" : (winner && !isWinner ? "bg-red-400" : "bg-blue-500"))}`}>
                                        &nbsp;
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>

            {
                (poll && poll.position === "START") && <PollTimer startTime={poll.start} duration={poll.duration} />
            }

            {
                winner && 
                <div className={"text-white roboto text-sm my-auto text-center"}>
                    {winner.option} won with {winner.votes} votes!
                </div>
            }

            {/* THIS BLOCK IS USED FOR EMULATING POLLS */}
            {/* <div className={"absolute space-x-4 flex flex-row top-72 bg-blue-500 flex-wrap"}>
                <button className={"bg-red-500 h-10 w-20"} onClick={() => {
                    setPollIsActive(true);
                    setNewPoll({"canvote":true,"myvote":0,"nick":"miaz","weighted":false,"start":DateTime.local().toISO(),"now":DateTime.local().toISO(),"time":30000,"question":"is this how polls workis this how polls workis this how polls workis this ?","options":["yes","no","maybe"],"totals":[0,0,0],"totalvotes":0, command: "POLLSTART"});
                }}>
                    START POLL
                </button>
                <button className={"bg-red-500 h-10 w-20"} onClick={() => {
                    endPoll({"canvote":true,"myvote":0,"nick":"miaz","weighted":false,"start":"2023-02-08T14:41:12+0000","now":"2023-02-08T14:41:12+0000","time":30000,"question":"is this how polls work?","options":["yes","no","maybe"],"totals":[33,153,10],"totalvotes":193, command: "POLLSTOP"});
                }}>
                    STOP POLL
                </button>
                <button className={"bg-red-500 h-10 w-20"} onClick={() => {
                    updatePoll(1);
                }}>
                    VOTE 1
                </button>
                <button className={"bg-red-500 h-10 w-20"} onClick={() => {
                    updatePoll(2);
                }}>
                    VOTE 2
                </button>
                <button className={"bg-red-500 h-10 w-20"} onClick={() => {
                    updatePoll(3);
                }}>
                    VOTE 3
                </button>
            </div> */}
        </div>
    );
}