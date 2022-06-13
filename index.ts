import { App } from 'vue';

const ONESIGNAL_SDK_ID = 'onesignal-sdk';
const ONE_SIGNAL_SCRIPT_SRC = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
const ONESIGNAL_NOT_SETUP_ERROR = 'OneSignal is not setup correctly.';
const MAX_TIMEOUT = 30;

let isOneSignalInitialized = false;
const vueOneSignalFunctionQueue: IOneSignalFunctionCall[] = [];

/* H E L P E R S */

const injectScript = () => {
  const script = document.createElement('script');
  script.id = ONESIGNAL_SDK_ID;
  script.src = ONE_SIGNAL_SCRIPT_SRC;
  script.async = true;
  document.head.appendChild(script);
}

const doesOneSignalExist = () => {
  if (window.OneSignal) {
    return true;
  }
  return false;
}

const processQueuedOneSignalFunctions = () => {
  vueOneSignalFunctionQueue.forEach(element => {
    const { name, args, promiseResolver } = element;

    if (!!promiseResolver) {
      OneSignalVue[name](...args).then((result: any) => {
        promiseResolver(result);
      });
    } else {
      window.OneSignal[name](...args);
    }
  });
}

const setupOneSignalIfMissing = () => {
  if (!doesOneSignalExist()) {
    window.OneSignal = window.OneSignal || [];
  }
}

/* T Y P E   D E C L A R A T I O N S */

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $OneSignal: IOneSignal;
  }
}

declare global {
  interface Window {
    OneSignal: any;
  }
}

interface IOneSignalFunctionCall {
  name: string;
  args: IArguments;
  promiseResolver?: Function;
}

type Action<T> = (item: T) => void;
interface AutoPromptOptions { force?: boolean; forceSlidedownOverNative?: boolean; slidedownPromptOptions?: IOneSignalAutoPromptOptions; }
interface RegisterOptions { modalPrompt?: boolean; httpPermissionRequest?: boolean; slidedown?: boolean; autoAccept?: boolean }
interface SetSMSOptions { identifierAuthHash?: string; }
interface SetEmailOptions { identifierAuthHash?: string; emailAuthHash?: string; }
interface TagsObject<T> { [key: string]: T; }
interface IOneSignalAutoPromptOptions { force?: boolean; forceSlidedownOverNative?: boolean; isInUpdateMode?: boolean; categoryOptions?: IOneSignalCategories; }
interface IOneSignalCategories { positiveUpdateButton: string; negativeUpdateButton: string; savingButtonText: string; errorButtonText: string; updateMessage: string; tags: IOneSignalTagCategory[]; }
interface IOneSignalTagCategory { tag: string; label: string; checked?: boolean; }

interface IInitObject {
  appId: string;
  subdomainName?: string;
  requiresUserPrivacyConsent?: boolean;
  promptOptions?: object;
  welcomeNotification?: object;
  notifyButton?: object;
  persistNotification?: boolean;
  webhooks?: object;
  autoResubscribe?: boolean;
  autoRegister?: boolean;
  notificationClickHandlerMatch?: string;
  notificationClickHandlerAction?: string;
  serviceWorkerParam?: { scope: string };
  serviceWorkerPath?: string;
  serviceWorkerUpdaterPath?: string;
  path?: string;
  allowLocalhostAsSecureOrigin?: boolean;
  [key: string]: any;
}

interface IOneSignal {
	init(options: IInitObject): Promise<void>
	on(event: string, listener: (eventData?: any) => void): void
	off(event: string, listener: (eventData?: any) => void): void
	once(event: string, listener: (eventData?: any) => void): void
	isPushNotificationsEnabled(callback?: Action<boolean>): Promise<boolean>
	showHttpPrompt(options?: AutoPromptOptions): Promise<void>
	registerForPushNotifications(options?: RegisterOptions): Promise<void>
	setDefaultNotificationUrl(url: string): Promise<void>
	setDefaultTitle(title: string): Promise<void>
	getTags(callback?: Action<any>): Promise<void>
	sendTag(key: string, value: any, callback?: Action<Object>): Promise<Object | null>
	sendTags(tags: TagsObject<any>, callback?: Action<Object>): Promise<Object | null>
	deleteTag(tag: string): Promise<Array<string>>
	deleteTags(tags: Array<string>, callback?: Action<Array<string>>): Promise<Array<string>>
	addListenerForNotificationOpened(callback?: Action<Notification>): Promise<void>
	setSubscription(newSubscription: boolean): Promise<void>
	showHttpPermissionRequest(options?: AutoPromptOptions): Promise<any>
	showNativePrompt(): Promise<void>
	showSlidedownPrompt(options?: AutoPromptOptions): Promise<void>
	showCategorySlidedown(options?: AutoPromptOptions): Promise<void>
	showSmsSlidedown(options?: AutoPromptOptions): Promise<void>
	showEmailSlidedown(options?: AutoPromptOptions): Promise<void>
	showSmsAndEmailSlidedown(options?: AutoPromptOptions): Promise<void>
	getNotificationPermission(onComplete?: Action<NotificationPermission>): Promise<NotificationPermission>
	getUserId(callback?: Action<string | undefined | null>): Promise<string | undefined | null>
	getSubscription(callback?: Action<boolean>): Promise<boolean>
	setEmail(email: string, options?: SetEmailOptions): Promise<string|null>
	setSMSNumber(smsNumber: string, options?: SetSMSOptions): Promise<string | null>
	logoutEmail(): Promise<void>
	logoutSMS(): Promise<void>
	setExternalUserId(externalUserId: string | undefined | null, authHash?: string): Promise<void>
	removeExternalUserId(): Promise<void>
	getExternalUserId(): Promise<string | undefined | null>
	provideUserConsent(consent: boolean): Promise<void>
	getEmailId(callback?: Action<string | undefined>): Promise<string | null | undefined>
	getSMSId(callback?: Action<string | undefined>): Promise<string | null | undefined>
	sendOutcome(outcomeName: string, outcomeWeight?: number | undefined): Promise<void>
	[index: string]: Function;
}


/* O N E S I G N A L   A P I  */

function init(options: IInitObject) {
  return new Promise<void>(resolve => {
    if (isOneSignalInitialized) {
      return;
    }

    injectScript();
    setupOneSignalIfMissing();
    window.OneSignal.push(() => {
      window.OneSignal.init(options);
    })

    const timeout = setTimeout(() => {
      console.error(ONESIGNAL_NOT_SETUP_ERROR);
    }, MAX_TIMEOUT * 1_000);

    window.OneSignal.push(() => {
      clearTimeout(timeout);
      isOneSignalInitialized = true;
      processQueuedOneSignalFunctions();
      resolve();
    });
  });
}

  function on(event: string, listener: (eventData?: any) => void): void {
    if (!doesOneSignalExist()) {
      vueOneSignalFunctionQueue.push({
        name: 'on',
        args: arguments,
      });
      return;
    }

    window.OneSignal.push(() => {
      window.OneSignal.on(event, listener)
    });
  }

  function off(event: string, listener: (eventData?: any) => void): void {
    if (!doesOneSignalExist()) {
      vueOneSignalFunctionQueue.push({
        name: 'off',
        args: arguments,
      });
      return;
    }

    window.OneSignal.push(() => {
      window.OneSignal.off(event, listener)
    });
  }

  function once(event: string, listener: (eventData?: any) => void): void {
    if (!doesOneSignalExist()) {
      vueOneSignalFunctionQueue.push({
        name: 'once',
        args: arguments,
      });
      return;
    }

    window.OneSignal.push(() => {
      window.OneSignal.once(event, listener)
    });
  }

  function isPushNotificationsEnabled(callback?: Action<boolean>): Promise<boolean> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'isPushNotificationsEnabled',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.isPushNotificationsEnabled(callback)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function showHttpPrompt(options?: AutoPromptOptions): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'showHttpPrompt',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.showHttpPrompt(options)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function registerForPushNotifications(options?: RegisterOptions): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'registerForPushNotifications',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.registerForPushNotifications(options)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function setDefaultNotificationUrl(url: string): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'setDefaultNotificationUrl',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.setDefaultNotificationUrl(url)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function setDefaultTitle(title: string): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'setDefaultTitle',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.setDefaultTitle(title)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function getTags(callback?: Action<any>): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'getTags',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.getTags(callback)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function sendTag(key: string, value: any, callback?: Action<Object>): Promise<Object | null> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'sendTag',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.sendTag(key, value, callback)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function sendTags(tags: TagsObject<any>, callback?: Action<Object>): Promise<Object | null> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'sendTags',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.sendTags(tags, callback)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function deleteTag(tag: string): Promise<Array<string>> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'deleteTag',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.deleteTag(tag)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function deleteTags(tags: Array<string>, callback?: Action<Array<string>>): Promise<Array<string>> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'deleteTags',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.deleteTags(tags, callback)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function addListenerForNotificationOpened(callback?: Action<Notification>): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'addListenerForNotificationOpened',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.addListenerForNotificationOpened(callback)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function setSubscription(newSubscription: boolean): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'setSubscription',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.setSubscription(newSubscription)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function showHttpPermissionRequest(options?: AutoPromptOptions): Promise<any> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'showHttpPermissionRequest',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.showHttpPermissionRequest(options)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function showNativePrompt(): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'showNativePrompt',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.showNativePrompt()
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function showSlidedownPrompt(options?: AutoPromptOptions): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'showSlidedownPrompt',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.showSlidedownPrompt(options)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function showCategorySlidedown(options?: AutoPromptOptions): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'showCategorySlidedown',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.showCategorySlidedown(options)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function showSmsSlidedown(options?: AutoPromptOptions): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'showSmsSlidedown',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.showSmsSlidedown(options)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function showEmailSlidedown(options?: AutoPromptOptions): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'showEmailSlidedown',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.showEmailSlidedown(options)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function showSmsAndEmailSlidedown(options?: AutoPromptOptions): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'showSmsAndEmailSlidedown',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.showSmsAndEmailSlidedown(options)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function getNotificationPermission(onComplete?: Action<NotificationPermission>): Promise<NotificationPermission> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'getNotificationPermission',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.getNotificationPermission(onComplete)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function getUserId(callback?: Action<string | undefined | null>): Promise<string | undefined | null> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'getUserId',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.getUserId(callback)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function getSubscription(callback?: Action<boolean>): Promise<boolean> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'getSubscription',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.getSubscription(callback)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function setEmail(email: string, options?: SetEmailOptions): Promise<string|null> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'setEmail',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.setEmail(email, options)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function setSMSNumber(smsNumber: string, options?: SetSMSOptions): Promise<string | null> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'setSMSNumber',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.setSMSNumber(smsNumber, options)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function logoutEmail(): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'logoutEmail',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.logoutEmail()
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function logoutSMS(): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'logoutSMS',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.logoutSMS()
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function setExternalUserId(externalUserId: string | undefined | null, authHash?: string): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'setExternalUserId',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.setExternalUserId(externalUserId, authHash)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function removeExternalUserId(): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'removeExternalUserId',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.removeExternalUserId()
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function getExternalUserId(): Promise<string | undefined | null> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'getExternalUserId',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.getExternalUserId()
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function provideUserConsent(consent: boolean): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'provideUserConsent',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.provideUserConsent(consent)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function getEmailId(callback?: Action<string | undefined>): Promise<string | null | undefined> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'getEmailId',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.getEmailId(callback)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function getSMSId(callback?: Action<string | undefined>): Promise<string | null | undefined> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'getSMSId',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.getSMSId(callback)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

  function sendOutcome(outcomeName: string, outcomeWeight?: number | undefined): Promise<void> {
    return new Promise(function (resolve, reject) {
      if (!doesOneSignalExist()) {
        vueOneSignalFunctionQueue.push({
          name: 'sendOutcome',
          args: arguments,
          promiseResolver: resolve,
        });
        return;
      }

      window.OneSignal.push(() => {
        window.OneSignal.sendOutcome(outcomeName, outcomeWeight)
          .then(value => resolve(value))
          .catch(error => reject(error));
      });
    });
  }

const OneSignalVue: IOneSignal = {
	init,
	on,
	off,
	once,
	isPushNotificationsEnabled,
	showHttpPrompt,
	registerForPushNotifications,
	setDefaultNotificationUrl,
	setDefaultTitle,
	getTags,
	sendTag,
	sendTags,
	deleteTag,
	deleteTags,
	addListenerForNotificationOpened,
	setSubscription,
	showHttpPermissionRequest,
	showNativePrompt,
	showSlidedownPrompt,
	showCategorySlidedown,
	showSmsSlidedown,
	showEmailSlidedown,
	showSmsAndEmailSlidedown,
	getNotificationPermission,
	getUserId,
	getSubscription,
	setEmail,
	setSMSNumber,
	logoutEmail,
	logoutSMS,
	setExternalUserId,
	removeExternalUserId,
	getExternalUserId,
	provideUserConsent,
	getEmailId,
	getSMSId,
	sendOutcome,
};

export const useOneSignal = () => {
  return OneSignalVue;
}

const OneSignalVuePlugin = {
  install(app: App, options: IInitObject) {
    app.config.globalProperties.$OneSignal = OneSignalVue as IOneSignal;
    app.config.globalProperties.$OneSignal.init(options);
  }
}

export default OneSignalVuePlugin;
