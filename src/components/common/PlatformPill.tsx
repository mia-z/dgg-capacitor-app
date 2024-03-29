import { DOMAttributes, FC } from "react";
import { logoTwitch, logoYoutube, helpCircleOutline } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { KickLogoIcon, RumbleLogoIcon } from "./../../Images";

type PlatformPillProps = {
    link: string,
    extraText: string,
    className?: string
} & DOMAttributes<HTMLDivElement>;

export const PlatformPill: FC<PlatformPillProps> = ({ link, extraText, className, onClick }) => {
    const title = link.split("/").length > 1 ? link.split("/")[1] : link;
    const platform = 
        link.startsWith("#youtube") ?  "youtube" :
        link.startsWith("#twitch") ? "twitch" :
        link.startsWith("#kick") ? "kick" :
        link.startsWith("#rumble") ? "rumble" :
        "unknown";

    switch (platform) {
        case "twitch": return (
            <div className={"flex flex-row bg-white w-full h-7 rounded-full shadow-lg active:bg-slate-300 " + className} onClick={onClick}>
                <div className={`w-10 flex rounded-l-full bg-[whitesmoke] border-r-[1px] border-r-slate-600`}>
                    <IonIcon style={{ color: "#6441A4" }} className={`text-xl m-auto`} icon={logoTwitch} />
                </div>
                <div className={"ml-2 w-[calc(100%-40px)] truncate whitespace-nowrap my-auto roboto"}>
                    <span className={"font-bold"}>{link.split("/").length > 1 ? link.split("/")[1] : link}</span>&nbsp;{extraText}
                </div>
            </div>
        )
        case "youtube": return (
            <div className={"flex flex-row bg-white w-full h-7 rounded-full shadow-lg active:bg-slate-300 " + className} onClick={onClick}>
                <div className={`w-10 flex rounded-l-full bg-[whitesmoke] border-r-[1px] border-r-slate-600`}>
                    <IonIcon style={{ color: "#FF0000" }} className={`text-xl m-auto`} icon={logoYoutube} />
                </div>
                <div className={"ml-2 w-[calc(100%-40px)] truncate whitespace-nowrap my-auto roboto"}>
                    {extraText}
                </div>
            </div>
        )
        case "kick": return (
            <div className={"flex flex-row bg-white w-full h-7 rounded-full shadow-lg active:bg-slate-300 " + className} onClick={onClick}>
                <div className={`w-10 flex rounded-l-full bg-[whitesmoke] border-r-[1px] border-r-slate-600`}>
                    <img style={{ color: "#FF0000" }} className={`h-5 w-6 text-xl m-auto`} src={KickLogoIcon} />
                </div>
                <div className={"ml-2 w-[calc(100%-40px)] truncate whitespace-nowrap my-auto roboto"}>
                    {link}
                </div>
            </div>
        )
        case "rumble": return (
            <div className={"flex flex-row bg-white w-full h-7 rounded-full shadow-lg active:bg-slate-300 " + className} onClick={onClick}>
                <div className={`w-10 flex rounded-l-full bg-[whitesmoke] border-r-[1px] border-r-slate-600`}>
                    <img style={{ color: "#FF0000" }} className={`h-5 w-5 text-xl m-auto`} src={RumbleLogoIcon} />
                </div>
                <div className={"ml-2 w-[calc(100%-40px)] truncate whitespace-nowrap my-auto roboto"}>
                    {link.split("/")[1]}
                </div>
            </div>
        )
        default: return (
            <div className={"flex flex-row bg-white w-full h-7 rounded-full shadow-lg active:bg-slate-300 " + className}>
                <div className={`w-10 flex rounded-l-full bg-[whitesmoke] border-r-[1px] border-r-slate-600`}>
                    <IonIcon style={{ color: "#DEDEDE" }} className={`text-xl m-auto`} icon={helpCircleOutline} />
                </div>
                <div className={"ml-2 w-[calc(100%-40px)] truncate whitespace-nowrap my-auto roboto"}>
                    <span className={"font-bold"}>{title}</span>&nbsp;{extraText}
                </div>
            </div>
        )
    }
}