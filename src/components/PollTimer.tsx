import { DateTime } from "luxon";
import React, { FC } from "react";
import { useTimer } from "react-timer-hook";

type PollTimerProps = {
    startTime: string,
    duration: number
}

export const PollTimer: FC<PollTimerProps> = ({ startTime, duration }) => {
    
    const { isRunning, seconds, restart, start } = useTimer({ 
        expiryTimestamp: DateTime.fromISO(startTime).plus({ milliseconds: duration, seconds: 1 }).toJSDate(),
        autoStart: true, 
        onExpire: () => { console.log("done") } 
    });

    return (
        <div className={""}>
            <div className={"text-center roboto mt-2 text-[#dedede]"}>
                {Math.floor(seconds)}s remaining..
            </div>
            
            <div className={"w-4/5 mx-auto h-2 rounded-lg mt-2"}>
                <div style={{ width: `${Math.floor((seconds / (duration / 1000)) * 100)}%` }} className={`mx-auto h-2 rounded-lg transition-all ${seconds > 10 ? "bg-blue-400" : "bg-red-400"}`}>

                </div>
            </div>
        </div>
    );
}