import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.app",
  appName: "hackcarpathia",
  webDir: "out",
  server: {
    url: "http://10.109.139.180:3000", // ← Twoje lokalne IP
    cleartext: true,
  },
};

export default config;
