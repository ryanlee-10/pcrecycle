import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ryanlee.pcrecycle",
  appName: "PCCycle",
  webDir: "out",
  server: {
    androidScheme: "https"
  }
};

export default config;
