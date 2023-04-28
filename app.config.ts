import { type ExpoConfig, type ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: 'my-app',
  name: 'My App',
  extra: {
    apiHost: process.env.APP_HOST,
    eas: {
      projectId: '605d1d65-f9ea-4340-bf0c-04fe06d624fd',
    },
  },
  plugins: [
    [
      'expo-av',
      {
        microphonePermission:
          'Allow $(PRODUCT_NAME) to access your microphone.',
      },
    ],
    [
      'expo-document-picker',
      {
        iCloudContainerEnvironment: 'Production',
      },
    ],
  ],
});
