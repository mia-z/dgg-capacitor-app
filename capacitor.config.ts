import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.miaz.dgg",
	appName: "dgg-cap",
	bundledWebRuntime: false,
	webDir: "dist",
	plugins: {
        
    },
	server: {
        hostname: "localhost"
    }
};

export default config;