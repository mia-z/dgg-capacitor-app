import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.miaz.appstiny",
	android: {
	
	},
	backgroundColor: "#191414",
	appName: "Appstiny",
	bundledWebRuntime: false,
	webDir: "dist",
	plugins: {
        CapacitorHttp: {
			enabled: true
		}
    },
	ios: {
		contentInset: "always"
	}
};

export default config;