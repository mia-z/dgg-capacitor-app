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
    }
};

export default config;