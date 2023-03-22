import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.miaz.appstiny",
	android: {
	
	},
	
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