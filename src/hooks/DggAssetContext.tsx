import { ReactNode, createContext, FC, useState } from "react";
import emotesJson from "../styles/assets/emotes.json";
import flairsJson from "../styles/assets/flairs.json";

type DggAssetsContextProps = {
	children: ReactNode | ReactNode[]
}

type DggAssetProps = {
	emotes: ChatEmote[],
	flairs: ChatFlair[],
	emoteRegex: RegExp
}

const initial: DggAssetProps = {
	emotes: [],
	flairs: [],
	emoteRegex: new RegExp("")
}

export const DggAssets = createContext<DggAssetProps>(initial);

export const DggAssetsContext: FC<DggAssetsContextProps> = ({ children }) => {
	const emoteNames = emotesJson.map(x => x.prefix);
	const reg = new RegExp(`^(${emoteNames.join("|")})$`, "g");

	const [emotes] = useState<ChatEmote[]>(emotesJson);
	const [flairs] = useState<ChatFlair[]>(flairsJson);
	const [emoteRegex] = useState<RegExp>(reg);

	return (
		<DggAssets.Provider value={{ emotes, flairs, emoteRegex }}>
			{children}
		</DggAssets.Provider>
	)
}