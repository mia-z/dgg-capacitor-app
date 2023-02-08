import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.miaz.dgg",
	appName: "dgg-cap",
	bundledWebRuntime: false,
	webDir: "dist",
	plugins: {
        CapacitorHttp: {
			enabled: true
		}
    }
};

export default config;