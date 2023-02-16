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

type DggPayloadCommand = "MSG" | "QUIT" | "JOIN" | "NAMES" | "BROADCAST" | "ERR"| "MUTE" | "BAN" | "PIN";

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
	type: "info" | "warning" | "error",
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
    description: string,
	timestamp: string,
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

type PollMessage = {
	canvote: boolean,
    myvote: number,
    nick: string,
    weighted: boolean,
    start: string,
    now: string,
    time: number,
    question: string,
    options: string[],
	totals: number[],
    totalvotes: number
}

type PinMessage = MessageBase & ChatUser & {
	command: "PIN",
	createdDate: string,
	uuid: string
}

type PollStartMessage = PollMessage & {
	command: "POLLSTART",
}

type PollStopMessage = PollMessage & {
	command: "POLLSTOP",
}

type PollState = {
	position: "START" | "END",
	canVote: boolean,
	myVote: number,
	weighted: boolean,
	start: string,
	duration: number,
	remaining: number,
	question: string,
	options: string[],
	totals: number[],
	totalVotes: number,
	author: string
}

type PinnedMessage = {
	user: ChatUser,
	createdDate: string,
	uuid: string,
	data: string,
	timestamp: string
}

type VoteCastMessage = {
	command: "VOTECAST",
	nick: string,
	vote: number
}

type UtilityMessage = MessageBase & {
	command: "UTILITY",
	utilityType: "HORIZONTAL_SPACER"
}

type MessageCollection = Array<MessageCollectionItem>;

type MessageCollectionItem = ChatMessage | BroadcastMessage | ErrorMessage | SystemMessage | UtilityMessage;

type DggPayloadItem = ChatMessage | QuitMessage | JoinMessage | BroadcastMessage | NamesMessage | ErrorMessage | MuteMessage | BanMessage | PollStartMessage | PollStopMessage | VoteCastMessage | PinMessage;

declare class MessageParseError extends Error {
    constructor(message: string);
}

declare class MessageMatchError extends Error {
    constructor(message: string);
}

type MessageError = MessageParseError | MessageMatchError;

type UnimplementedMessage = any;

type LiveResponseType = "dggApi:streamInfo" | "dggApi:youtubeVods" | "dggApi:videos" | "dggApi:hosting";

type LiveResponseData<T> =
	T extends "dggApi:streamInfo" ? StreamInfo :
	T extends "dggApi:hosting" ? HostInfo :
	T extends "dggApi:videos" ? VideosInfo :
	T extends "dggApi:youtubeVods" ? VodsInfo : 
	never;

type DggLiveResponse<T> = 
	T extends `dggApi:streamInfo` ? {
		type: `dggApi:streamInfo`,
		data: StreamInfo
	} : 
	T extends `dggApi:hosting` ? {
		type: `dggApi:hosting`,
		data: HostInfo
	} : 
	T extends `dggApi:videos` ? {
		type: `dggApi:videos`,
		data: VideosInfo
	} : 
	T extends `dggApi:youtubeVods` ? {
		type: `dggApi:youtubeVods`,
		data: VodsInfo
	} : never;

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

type VideosInfo = {
	videos: {
		id: string,
		title: string,
		mediumThumbnailUrl: string,
		highThumbnailUrl: string,
		url: string,
		thumbnailHref: string
	}[]
}

type VodsInfo = {
	id: string,
	title: string,
	mediumThumbnailUrl: string,
	highThumbnailUrl: string,
	url: string,
	streamStartTime: string,
	streamEndTime: string
}[];

declare const Platforms = ["youtube", "twitch", "rumble"] as const;

type SupportedPlatforms = typeof Platforms[number];

type EmbedInfo = {
	platform: SupportedPlatforms,
	videoId: string
}

type EventNames = "chat" | "live";



declare namespace Vyneer {
	type Embed = {
		link: string,
		platform: string,
		channel: string,
		title: string,
		timestamp: string
	}
}