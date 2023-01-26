import React, {FC} from "react";

type BroadcastLineProps = {
    data: string
}

export const BroadcastLine: FC<BroadcastLineProps> = ({ data }) => {
    return (
		<div className={"msg-chat msg-broadcast"}>
			{data}
		</div>
	);
}