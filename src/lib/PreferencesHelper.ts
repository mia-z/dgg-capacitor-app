import { Preferences} from "@capacitor/preferences";

export const SetLoginToken = async (token: string): Promise<void> => {
	await Preferences.set({
		key: "LoginToken",
		value: token
    });
}

export const GetLoginToken = async (): Promise<string | null> => {
    const getResult = await Preferences.get({ key: "LoginToken" });
    return getResult.value;
}

export const SetUserData = async (data: DggUser): Promise<void> => {
    await Preferences.set({
		key: "UserData",
		value: JSON.stringify(data)
    });
}

export const GetUserData = async (): Promise<DggUser | null> => {
    const getResult = await Preferences.get({ key: "UserData" });
    if (!getResult.value)
        return null;
    return JSON.parse(getResult.value as string);
}

export const HasSeenLoginInfo = async (): Promise<boolean> => {
	const exists = await Preferences.get({ key: "newUser" });
	if (exists.value === null || exists.value === "") {
		return false;
	} else {
		return true;
	}
}

export const ResetSeenLoginInfo = async (): Promise<void> => {
	await Preferences.remove({ key: "newUser" });

}

export const SetHasSeenLoginInfo = async (): Promise<void> => {
	await Preferences.set({ key: "newUser", value: "notnew" });
}

export const ClearUserData = async (): Promise<void> => {
	await Preferences.remove({ key: "LoginToken" });
	await Preferences.remove({ key: "UserData" });
}