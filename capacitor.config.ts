import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.miaz.dgg",
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
	},
	server: {
		iosScheme: "http"
	}
};

export default config;