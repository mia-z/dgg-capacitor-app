import React, { FC, TouchEvent, useState } from "react"
import { useBoundStore } from "../hooks/useBoundStore";

type UtilityLineProps = {
    data: string,
    command: "UTILITY",
    utilityType: "HORIZONTAL_SPACER",
    timestamp: string
}

export const UtilityLine: FC<UtilityLineProps> = ({ data, command, utilityType, timestamp }) => {
    switch (utilityType) {
        case "HORIZONTAL_SPACER": return (
            <div className={"w-4/5 mx-auto border-t my-3 flex flex-col"}>
                <div className={"text-center mt-1 text-[#dedede]"}>End of chat history</div>
            </div>
        );
    }
}
