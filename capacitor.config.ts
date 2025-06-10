import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.myapp',
  appName: 'MyApp',
  webDir: 'dist/',
  server: {
    url: 'https://guido-three.vercel.app',
    cleartext: true
  }
};

export default config;