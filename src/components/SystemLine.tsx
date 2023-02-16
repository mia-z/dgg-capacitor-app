import React, { FC, TouchEvent, useState } from "react"
import { useBoundStore } from "../hooks/useBoundStore";

type SystemLineProps = {
    data: string,
	type: "info" | "warning" | "error",
    command: "SYS",
    timestamp: string
}

export const SystemLine: FC<SystemLineProps> = ({ data, command, type, timestamp }) => {
    switch (type) {
        case "info": return (
            <div className={"mt-1 text-[#dedede]"}>{data}</div>
        );
        default: return null;
    }
}
