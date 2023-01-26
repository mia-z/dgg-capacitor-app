declare module "*.svg" {
    import React from 'react';
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
}

declare module "*/flairs.json" {
    const flairs: ChatFlair[];
    export default flairs;
}

declare module "*/emotes.json" {
    const emotes: ChatEmote[];
    export default emotes;
}

declare module "*.png" {
	const value: any;
	export = value;
}

declare type DggUserFeature = "subscriber" | "flair1" | string;

declare type DggUserRole = "USER" | "SUBSCRIBER" | string;

const StringSettingsOption = [
    "notificationwhisper",
	"timestampformat",
	"fontscale",
	"showremoved"
] as const;

const NumberSettingsOption = [
    "schemaversion",
	"maxlines"
] as const;

const ArraySettingsOption = [
    "taggednotes",
	"highlightnicks",
	"customhighlight",
	"taggednicks",
	"ignorenicks"
] as const;

const BooleanSettingsOption = [
    "schemaversion",
	"showtime",
	"hideflairicons",
	"profilesettings",
	"notificationwhisper",
	"notificationhighlight",
	"highlight",
	"showhispersinchat",
	"focusmentioned",
	"notificationtimeout",
	"ignorementions",
	"autocompletehelper",
	"taggedvisibility",
	"hidensfw",
	"hidensfl",
	"censorbadwords"
] as const;

type CdnImage = {
    url: string,
	name: string,
	mime: string,
	height: number,
	width: number
}

type ChatFlair = {
    label: string,
	name: string,
	hidden: boolean,
	priority: number,
	color: string,
	rainbowColor: boolean,
	image: CdnImage[]
}

type ChatEmote = {
    prefix: string,
	twitch: boolean,
	theme: string,
	minimumSubTier: number,
	image: CdnImage[]
}

declare type DggUserSettings = [
    DggUserSettingOption
];

type DggUserSettingOption = |
  	[ typeof StringSettingsOption[number], string ] |
  	[ typeof NumberSettingsOption[number], number ] |
  	[ typeof BooleanSettingsOption[number], boolean ] |
	[ typeof ArraySettingsOption[number], string[] ];

declare type DggUser = {
    authProvider: string,
	country: string,
	createdDate: string,
	features: Array<DggUserFeature>,
	nick: string,
	roles: Array<DggUserRole>,
	settings: DggUserSettings,
	subscription: boolean | null,
	team: "YEE" | "PEPE",
	userId: string,
	userStatus: string,
	username: string
}

type SubscriberFlair = Tier1Sub | Tier2Sub | Tier3Sub | Tier4Sub | Tier5Sub;

type Tier1Sub = "flair13";
type Tier2Sub = "flair1";
type Tier3Sub = "flair3";
type Tier4Sub = "flair8";
type Tier5Sub = "flair42";

type DggPayloadCommand = "MSG" | "QUIT" | "JOIN" | "NAMES" | "BROADCAST" | "ERR"| "MUTE" | "BAN";

type UtilityCommand = "UTILITY";

type ChatMessageCommand = DggPayloadCommand & UtilityCommand;

type ChatUser = Pick<DggUser, "features" | "nick">;

type MessageBase = {
    data: string,
	isHidden: boolean,
	timestamp: string,
}

type ChatUserAndTimestampMessage = MessageBase & ChatUser & {
	isSameNickAsPrevious: boolean,
	isEmoteComboMessage: boolean,
	isEmoteComboFinished: boolean,
	comboCount: number
}

type ChatMessage = ChatUserAndTimestampMessage & {
    command: "MSG"
}

type SystemMessage = MessageBase & {
	type: "warning" | "error",
	command: "SYS"
}

type QuitMessage = ChatUserAndTimestampMessage & {
    command: "QUIT"
}

type JoinMessage = ChatUserAndTimestampMessage & {
    command: "JOIN"
}

type ErrorMessage = {
    command: "ERR",
    description: string
}

type BroadcastMessage = {
    command: "BROADCAST",
	timestamp: string,
	data: string
}

type NamesMessage = {
    command: "NAMES",
    connectionCount: number,
	users: ChatUser[]
}

type MuteMessage =  ChatUserAndTimestampMessage & {
    command: "MUTE",
    duration: string
}

type BanMessage =  ChatUserAndTimestampMessage & {
	command: "BAN",
	duration: string
}

type UtilityMessage = MessageBase & {
	command: "UTILITY",
	utilityType: "HORIZONTAL_SPACER"
}

type MessageCollection = Array<MessageCollectionItem>;

type MessageCollectionItem = ChatMessage | BroadcastMessage | ErrorMessage | SystemMessage | UtilityMessage;

type DggPayloadItem = ChatMessage | QuitMessage | JoinMessage | BroadcastMessage | NamesMessage | ErrorMessage | MuteMessage | BanMessage;

declare class MessageParseError extends Error {
    constructor(message: string);
}

declare class MessageMatchError extends Error {
    constructor(message: string);
}

type MessageError = MessageParseError | MessageMatchError;

type UnimplementedMessage = any;

type LiveResponseType = "dggApi:streamInfo" | "dggApi:youtubeVods" | "dggApi:videos" | "dggApi:youtubeVideos" | "dggApi:hosting";

type LiveResponseData<T> =
	T extends "dggApi:streamInfo" ? StreamInfo :
	T extends "dggApi:hosting" ? HostInfo :
	any;

type DggLiveResponse<T> = {
    type: LiveResponseType,
	data: LiveResponseData<T>
}

type StreamInfo = {
    hostedChannel: string | undefined,
	streams: {
        twitch: any,
		youtube: {
            live: boolean,
			game: string | undefined,
			preview: string,
			status_text: string,
			started_at: string,
			ended_at: string,
			duration: number,
			viewers: number,
			id: string,
			platform: "youtube",
			type: "livestream" | string
		},
		facebook: any,
		rumble: {
            live: boolean,
			game: string | undefined,
			preview: string,
			status_text: string,
			started_at: string,
			ended_at: string,
			duration: number,
			viewers: number,
			id: string,
			platform: "rumble",
			type: "livestream" | string
		},
    }
}

type HostInfo = {
    id: string,
	playform: "youtube",
	displayName: string,
	url: string
}

type SupportedPlatforms = "youtube" | "twitch";

type EmbedInfo = {
	platform: SupportedPlatforms,
	videoId: string
}

declare namespace Vyneer {
	type Embed = {
		link: string,
		platform: string,
		channel: string,
		title: string,
		timestamp: string
	}
}