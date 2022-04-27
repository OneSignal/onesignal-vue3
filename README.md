<h1 align="center">welcome to onesignal-vue3 👋</h1>

[![npm version](https://img.shields.io/npm/v/@onesignal/onesignal-vue3.svg)](https://www.npmjs.com/package/@onesignal/onesignal-vue3) [![npm downloads](https://img.shields.io/npm/dm/@onesignal/onesignal-vue3.svg)](https://www.npmjs.com/package/@onesignal/onesignal-vue3)

Vue OneSignal Plugin: Make it easy to integrate OneSignal with your Vue App!

This is a JavaScript module that can be used to easily include [OneSignal](https://onesignal.com/) code in a website or app that uses Vue for its front-end codebase.

OneSignal is the world's leader for Mobile Push Notifications, Web Push, and In-App Messaging. It is trusted by 800k businesses to send 5 billion Push Notifications per day.

You can find more information on OneSignal [here](https://onesignal.com/).

* 🏠 [Homepage](https://onesignal.com)
* 🖤 [npm](https://www.npmjs.com/package/@onesignal/onesignal-vue3)

## Contents
- [Install](#install)
- [Usage](#usage)
- [API](#onesignal-api)
- [Advanced Usage](#advanced-usage)

---
## Vue Compatibility
Make sure you install a plugin version compatible with your Vue environment.

| Vue | OneSignal Plugin |
|-----|------------------|
| 2   | [onesignal-vue](https://github.com/OneSignal/onesignal-vue)              |
| 3   | onesignal-vue3               |

## Install

You can use `yarn` or `npm`.


### Yarn

```bash
yarn add @onesignal/onesignal-vue3
```

### npm

```bash
npm install --save @onesignal/onesignal-vue3
```

---
## Usage

## Plugin setup

In Vue 3, you can pass in the OneSignal initialization options directly as an argument to the `use` function. You can still initialize separately if you prefer editor benefits like code-completion.

```js
// main
import { createApp } from 'vue'
import OneSignalVuePlugin from '@onesignal/onesignal-vue3'

createApp(App).use(OneSignalVuePlugin, {
  appId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
}).mount('#app');

```
or

```js
//main
import { createApp } from 'vue'
import OneSignalVuePlugin from '@onesignal/onesignal-vue3'

createApp(App).use(OneSignalVuePlugin).mount('#app');

// component
this.$OneSignal.init({
  appId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
});

```

The OneSignal plugin automatically exposes a `$OneSignal` global property accessible inside the application.

### Composition API

You can also leverage Vue's [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) via the `useOneSignal` function that can be called from within [`setup`](https://vuejs.org/api/composition-api-setup.html#basic-usage).

## Reference
### Initialization
The `init` function returns a promise that resolves when OneSignal is loaded.

**Examples**
```js
await this.$OneSignal.init({ appId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' });
// do other stuff
```

```js
this.$OneSignal.init({ appId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }).then(() => {
  // do other stuff
});
```

### Options
You can pass other [options](https://documentation.onesignal.com/docs/web-push-sdk#init) to the `init` function. Use these options to configure personalized prompt options, auto-resubscribe, and more.

**Service Worker Params**
You can customize the location and filenames of service worker assets. You are also able to specify the specific scope that your service worker should control. You can read more [here](https://documentation.onesignal.com/docs/onesignal-service-worker-faq#sdk-parameter-reference-for-service-workers).

In this distribution, you can specify the parameters via the following:

| Field                      | Details                                                                                                                |
|----------------------------|------------------------------------------------------------------------------------------------------------------------|
| `serviceWorkerParam`       | Use to specify the scope, or the path the service worker has control of.  Example:  `{ scope: "/js/push/onesignal/" }` |
| `serviceWorkerPath`        | The path to the service worker file.                                                                                   |

### Service Worker File
If you haven't done so already, you will need to add the [OneSignal Service Worker file](https://github.com/OneSignal/OneSignal-Website-SDK/files/7585231/OneSignal-Web-SDK-HTTPS-Integration-Files.zip) to your site ([learn more](https://documentation.onesignal.com/docs/web-push-quickstart#step-6-upload-files)).

The OneSignal SDK file must be publicly accessible. You can put them in your top-level root or a subdirectory. However, if you are placing the file not on top-level root make sure to specify the path via the service worker params in the init options (see section above).

**Tip:**
Visit `https://yoursite.com/OneSignalSDKWorker.js` in the address bar to make sure the files are being served successfully.

### Code completion
If IntelliSense is not working as expected in your `.vue` file, try adding an import from the OneSignal plugin.


![intellisense](https://user-images.githubusercontent.com/11739227/164801900-96592534-f991-49e0-ba36-e02bb04f31b8.png)


### Typescript
This package includes Typescript support.

```ts
interface IOneSignal {
  init(options: IInitObject): Promise<void>;
  on(event: string, listener: () => void): void;
  off(event: string, listener: () => void): void;
  once(event: string, listener: () => void): void;
  isPushNotificationsEnabled(callback?: Action<boolean>): Promise<boolean>;
  showHttpPrompt(options?: AutoPromptOptions): Promise<void>;
  registerForPushNotifications(options?: RegisterOptions): Promise<void>;
  setDefaultNotificationUrl(url: string): Promise<void>;
  setDefaultTitle(title: string): Promise<void>;
  getTags(callback?: Action<any>): Promise<void>;
  sendTag(key: string, value: any, callback?: Action<Object>): Promise<Object | null>;
  sendTags(tags: TagsObject<any>, callback?: Action<Object>): Promise<Object | null>;
  deleteTag(tag: string): Promise<Array<string>>;
  deleteTags(tags: Array<string>, callback?: Action<Array<string>>): Promise<Array<string>>;
  addListenerForNotificationOpened(callback?: Action<Notification>): Promise<void>;
  setSubscription(newSubscription: boolean): Promise<void>;
  showHttpPermissionRequest(options?: AutoPromptOptions): Promise<any>;
  showNativePrompt(): Promise<void>;
  showSlidedownPrompt(options?: AutoPromptOptions): Promise<void>;
  showCategorySlidedown(options?: AutoPromptOptions): Promise<void>;
  showSmsSlidedown(options?: AutoPromptOptions): Promise<void>;
  showEmailSlidedown(options?: AutoPromptOptions): Promise<void>;
  showSmsAndEmailSlidedown(options?: AutoPromptOptions): Promise<void>;
  getNotificationPermission(onComplete?: Function): Promise<NotificationPermission>;
  getUserId(callback?: Action<string | undefined | null>): Promise<string | undefined | null>;
  getSubscription(callback?: Action<boolean>): Promise<boolean>;
  setEmail(email: string, options?: SetEmailOptions): Promise<string | null>;
  setSMSNumber(smsNumber: string, options?: SetSMSOptions): Promise<string | null>;
  logoutEmail(): Promise<void>;
  logoutSMS(): Promise<void>;
  setExternalUserId(externalUserId: string | undefined | null, authHash?: string): Promise<void>;
  removeExternalUserId(): Promise<void>;
  getExternalUserId(): Promise<string | undefined | null>;
  provideUserConsent(consent: boolean): Promise<void>;
  getEmailId(callback?: Action<string | undefined>): Promise<string | null | undefined>;
  getSMSId(callback?: Action<string | undefined>): Promise<string | null | undefined>;
  sendOutcome(outcomeName: string, outcomeWeight?: number | undefined): Promise<void>;
}
```

### OneSignal API
See the official [OneSignal WebSDK reference](https://documentation.onesignal.com/docs/web-push-sdk) for information on all available SDK functions.

---
## Advanced Usage
### Events and Event Listeners
Use listeners to react to OneSignal-related events:

* `subscriptionChange`
* `permissionPromptDisplay`
* `notificationPermissionChange`
* `popoverShown`
* `customPromptClick`
* `notificationDisplay`
* `notificationDismiss`

**Example**
```js
this.$OneSignal.on('subscriptionChange', function(isSubscribed) {
  console.log("The user's subscription state is now:", isSubscribed);
});
```

See the [OneSignal WebSDK Reference](https://documentation.onesignal.com/docs/web-push-sdk) for all available event listeners.

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/OneSignal/onesignal-vue3/issues).

## Show your support

Give a ⭐️ if this project helped you!

## OneSignal

* [Website](https://onesignal.com)
* Twitter: [@onesignal](https://twitter.com/onesignal)
* Github: [@OneSignal](https://github.com/OneSignal)
* LinkedIn: [@onesignal](https://linkedin.com/company/onesignal)

## Discord
Reach out to us via our [Discord server](https://discord.com/invite/EP7gf6Uz7G)!

## 📝 License

Copyright © 2022 [OneSignal](https://github.com/OneSignal).<br />
This project is [Modified MIT](https://github.com/OneSignal/onesignal-vue3/blob/main/LICENSE) licensed.


Enjoy!
