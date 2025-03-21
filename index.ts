import { App } from 'vue';

const ONESIGNAL_SDK_ID = 'onesignal-sdk';
const ONE_SIGNAL_SCRIPT_SRC = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";

// true if the script is successfully loaded from CDN.
let isOneSignalInitialized = false;
// true if the script fails to load from CDN. A separate flag is necessary
// to disambiguate between a CDN load failure and a delayed call to
// OneSignal#init.
let isOneSignalScriptFailed = false;

if (typeof window !== 'undefined') {
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  addSDKScript();
}

/* H E L P E R S */

function handleOnError() {
  isOneSignalScriptFailed = true;
}

function addSDKScript() {
  const script = document.createElement('script');
  script.id = ONESIGNAL_SDK_ID;
  script.defer = true;
  script.src = ONE_SIGNAL_SCRIPT_SRC;

  // Always resolve whether or not the script is successfully initialized.
  // This is important for users who may block cdn.onesignal.com w/ adblock.
  script.onerror = () => {
    handleOnError();
  }

  document.head.appendChild(script);
}
/* T Y P E   D E C L A R A T I O N S */

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $OneSignal: IOneSignalOneSignal;
  }
}

declare global {
  interface Window {
    OneSignalDeferred?: OneSignalDeferredLoadedCallback[];
    OneSignal?: IOneSignalOneSignal;
    safari?: {
      pushNotification: any;
    };
  }
}


/* O N E S I G N A L   A P I  */

/**
 * @PublicApi
 */
 const init = (options: IInitObject): Promise<void> => {
  if (isOneSignalInitialized) {
    return Promise.reject(`OneSignal is already initialized.`);
  }

  if (!options || !options.appId) {
    throw new Error('You need to provide your OneSignal appId.');
  }

  if (!document) {
    return Promise.reject(`Document is not defined.`);
  }

  return new Promise<void>((resolve) => {
    window.OneSignalDeferred?.push((OneSignal) => {
      OneSignal.init(options).then(() => {
        isOneSignalInitialized = true;
        resolve();
      });
    });
  });
};


/**
 * The following code is copied directly from the native SDK source file BrowserSupportsPush.ts
 * S T A R T
 */

// Checks if the browser supports push notifications by checking if specific
//   classes and properties on them exist
function isPushNotificationsSupported() {
  return supportsVapidPush() || supportsSafariPush();
}

function isMacOSSafariInIframe(): boolean {
  // Fallback detection for Safari on macOS in an iframe context
  return window.top !== window && // isContextIframe
  navigator.vendor === "Apple Computer, Inc." && // isSafari
  navigator.platform === "MacIntel"; // isMacOS
}

function supportsSafariPush(): boolean {
  return (window.safari && typeof window.safari.pushNotification !== "undefined") ||
          isMacOSSafariInIframe();
}

// Does the browser support the standard Push API
function supportsVapidPush(): boolean {
  return typeof PushSubscriptionOptions !== "undefined" &&
         PushSubscriptionOptions.prototype.hasOwnProperty("applicationServerKey");
}
/* E N D */

/**
 * @PublicApi
 */
const isPushSupported = (): boolean => {
  return isPushNotificationsSupported();
}

interface AutoPromptOptions { force?: boolean; forceSlidedownOverNative?: boolean; slidedownPromptOptions?: IOneSignalAutoPromptOptions; }
interface IOneSignalAutoPromptOptions { force?: boolean; forceSlidedownOverNative?: boolean; isInUpdateMode?: boolean; categoryOptions?: IOneSignalCategories; }
interface IOneSignalCategories { positiveUpdateButton: string; negativeUpdateButton: string; savingButtonText: string; errorButtonText: string; updateMessage: string; tags: IOneSignalTagCategory[]; }
interface IOneSignalTagCategory { tag: string; label: string; checked?: boolean; }
type PushSubscriptionNamespaceProperties = { id: string | null | undefined; token: string | null | undefined; optedIn: boolean; };
type SubscriptionChangeEvent = { previous: PushSubscriptionNamespaceProperties; current: PushSubscriptionNamespaceProperties; };
type NotificationEventName = 'click' | 'foregroundWillDisplay' | 'dismiss' | 'permissionChange' | 'permissionPromptDisplay';
type SlidedownEventName = 'slidedownShown';
type OneSignalDeferredLoadedCallback = (onesignal: IOneSignalOneSignal) => void;
interface IOSNotification {
  /**
   * The OneSignal notification id;
   *  - Primary id on OneSignal's REST API and dashboard
   */
  readonly notificationId: string;

  /**
   * Visible title text on the notification
   */
  readonly title?: string;

  /**
   * Visible body text on the notification
   */
  readonly body: string;

  /**
   * Visible icon the notification; URL format
   */
  readonly icon?: string;

  /**
   * Visible small badgeIcon that displays on some devices; URL format
   * Example: On Android's status bar
   */
  readonly badgeIcon?: string;

  /**
   * Visible image on the notification; URL format
   */
  readonly image?: string;

  /**
   * Visible buttons on the notification
   */
  readonly actionButtons?: IOSNotificationActionButton[];

  /**
   * If this value is the same as existing notification, it will replace it
   * Can be set when creating the notification with "Web Push Topic" on the dashboard
   * or web_push_topic from the REST API.
   */
  readonly topic?: string;

  /**
   * Custom object that was sent with the notification;
   * definable when creating the notification from the OneSignal REST API or dashboard
   */
  readonly additionalData?: object;

  /**
   * URL to open when clicking or tapping on the notification
   */
  readonly launchURL?: string;

  /**
   * Confirm the push was received by reporting back to OneSignal
   */
  readonly confirmDelivery: boolean;
}

interface IOSNotificationActionButton {
  /**
   * Any unique identifier to represent which button was clicked. This is typically passed back to the service worker
   * and host page through events to identify which button was clicked.
   * e.g. 'like-button'
   */
  readonly actionId: string;
  /**
   * The notification action button's text.
   */
  readonly text: string;
  /**
   * A valid publicly reachable HTTPS URL to an image.
   */
  readonly icon?: string;
  /**
   * The URL to open the web browser to when this action button is clicked.
   */
  readonly launchURL?: string;
}

interface NotificationClickResult {
  readonly actionId?: string;
  readonly url?: string;
}

type NotificationEventTypeMap = {
  'click': NotificationClickEvent;
  'foregroundWillDisplay': NotificationForegroundWillDisplayEvent;
  'dismiss': NotificationDismissEvent;
  'permissionChange': boolean;
  'permissionPromptDisplay': void;
};

interface NotificationForegroundWillDisplayEvent {
  readonly notification: IOSNotification;
  preventDefault(): void;
}

interface NotificationDismissEvent {
  notification: IOSNotification;
}

interface NotificationClickEvent {
  readonly notification: IOSNotification;
  readonly result: NotificationClickResult;
}

type UserChangeEvent = {
  current: UserNamespaceProperties;
};
type UserNamespaceProperties = {
  onesignalId: string | undefined;
  externalId: string | undefined;
};

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
  path?: string;
  serviceWorkerParam?: { scope: string };
  serviceWorkerPath?: string;
  serviceWorkerOverrideForTypical?: boolean;
  serviceWorkerUpdaterPath?: string;
  allowLocalhostAsSecureOrigin?: boolean;
  [key: string]: any;
}

interface IOneSignalOneSignal {
	Slidedown: IOneSignalSlidedown;
	Notifications: IOneSignalNotifications;
	Session: IOneSignalSession;
	User: IOneSignalUser;
	Debug: IOneSignalDebug;
	login(externalId: string, jwtToken?: string): Promise<void>;
	logout(): Promise<void>;
	init(options: IInitObject): Promise<void>;
	setConsentGiven(consent: boolean): Promise<void>;
	setConsentRequired(requiresConsent: boolean): Promise<void>;
}
interface IOneSignalNotifications {
	permissionNative: NotificationPermission;
	permission: boolean;
	setDefaultUrl(url: string): Promise<void>;
	setDefaultTitle(title: string): Promise<void>;
	isPushSupported(): boolean;
	requestPermission(): Promise<void>;
	addEventListener<K extends NotificationEventName>(event: K, listener: (obj: NotificationEventTypeMap[K]) => void): void;
	removeEventListener<K extends NotificationEventName>(event: K, listener: (obj: NotificationEventTypeMap[K]) => void): void;
}
interface IOneSignalSlidedown {
	promptPush(options?: AutoPromptOptions): Promise<void>;
	promptPushCategories(options?: AutoPromptOptions): Promise<void>;
	promptSms(options?: AutoPromptOptions): Promise<void>;
	promptEmail(options?: AutoPromptOptions): Promise<void>;
	promptSmsAndEmail(options?: AutoPromptOptions): Promise<void>;
	addEventListener(event: SlidedownEventName, listener: (wasShown: boolean) => void): void;
	removeEventListener(event: SlidedownEventName, listener: (wasShown: boolean) => void): void;
}
interface IOneSignalDebug {
	setLogLevel(logLevel: string): void;
}
interface IOneSignalSession {
	sendOutcome(outcomeName: string, outcomeWeight?: number): Promise<void>;
	sendUniqueOutcome(outcomeName: string): Promise<void>;
}
interface IOneSignalUser {
	onesignalId: string | undefined;
	externalId: string | undefined;
	PushSubscription: IOneSignalPushSubscription;
	addAlias(label: string, id: string): void;
	addAliases(aliases: { [key: string]: string }): void;
	removeAlias(label: string): void;
	removeAliases(labels: string[]): void;
	addEmail(email: string): void;
	removeEmail(email: string): void;
	addSms(smsNumber: string): void;
	removeSms(smsNumber: string): void;
	addTag(key: string, value: string): void;
	addTags(tags: { [key: string]: string }): void;
	removeTag(key: string): void;
	removeTags(keys: string[]): void;
	getTags(): { [key: string]: string };
	addEventListener(event: 'change', listener: (change: UserChangeEvent) => void): void;
	removeEventListener(event: 'change', listener: (change: UserChangeEvent) => void): void;
	setLanguage(language: string): void;
	getLanguage(): string;
}
interface IOneSignalPushSubscription {
	id: string | null | undefined;
	token: string | null | undefined;
	optedIn: boolean | undefined;
	optIn(): Promise<void>;
	optOut(): Promise<void>;
	addEventListener(event: 'change', listener: (change: SubscriptionChangeEvent) => void): void;
	removeEventListener(event: 'change', listener: (change: SubscriptionChangeEvent) => void): void;
}
function oneSignalLogin(externalId: string, jwtToken?: string): Promise<void> {
  return new Promise(function (resolve, reject) {
    if (isOneSignalScriptFailed) {
      reject(new Error('OneSignal script failed to load.'));
      return;
    }

    try {
      window.OneSignalDeferred?.push((OneSignal) => {
        OneSignal.login(externalId, jwtToken).then(() => resolve())
          .catch(error => reject(error));
      });
    } catch (error) {
      reject(error);
    }
  });
}
function oneSignalLogout(): Promise<void> {
  return new Promise(function (resolve, reject) {
    if (isOneSignalScriptFailed) {
      reject(new Error('OneSignal script failed to load.'));
      return;
    }

    try {
      window.OneSignalDeferred?.push((OneSignal) => {
        OneSignal.logout().then(() => resolve())
          .catch(error => reject(error));
      });
    } catch (error) {
      reject(error);
    }
  });
}
function oneSignalSetConsentGiven(consent: boolean): Promise<void> {
  return new Promise(function (resolve, reject) {
    if (isOneSignalScriptFailed) {
      reject(new Error('OneSignal script failed to load.'));
      return;
    }

    try {
      window.OneSignalDeferred?.push((OneSignal) => {
        OneSignal.setConsentGiven(consent).then(() => resolve())
          .catch(error => reject(error));
      });
    } catch (error) {
      reject(error);
    }
  });
}
function oneSignalSetConsentRequired(requiresConsent: boolean): Promise<void> {
  return new Promise(function (resolve, reject) {
    if (isOneSignalScriptFailed) {
      reject(new Error('OneSignal script failed to load.'));
      return;
    }

    try {
      window.OneSignalDeferred?.push((OneSignal) => {
        OneSignal.setConsentRequired(requiresConsent).then(() => resolve())
          .catch(error => reject(error));
      });
    } catch (error) {
      reject(error);
    }
  });
}
function slidedownPromptPush(options?: AutoPromptOptions): Promise<void> {
  return new Promise(function (resolve, reject) {
    if (isOneSignalScriptFailed) {
      reject(new Error('OneSignal script failed to load.'));
      return;
    }

    try {
      window.OneSignalDeferred?.push((OneSignal) => {
        OneSignal.Slidedown.promptPush(options).then(() => resolve())
          .catch(error => reject(error));
      });
    } catch (error) {
      reject(error);
    }
  });
}
function slidedownPromptPushCategories(options?: AutoPromptOptions): Promise<void> {
  return new Promise(function (resolve, reject) {
    if (isOneSignalScriptFailed) {
      reject(new Error('OneSignal script failed to load.'));
      return;
    }

    try {
      window.OneSignalDeferred?.push((OneSignal) => {
        OneSignal.Slidedown.promptPushCategories(options).then(() => resolve())
          .catch(error => reject(error));
      });
    } catch (error) {
      reject(error);
    }
  });
}
function slidedownPromptSms(options?: AutoPromptOptions): Promise<void> {
  return new Promise(function (resolve, reject) {
    if (isOneSignalScriptFailed) {
      reject(new Error('OneSignal script failed to load.'));
      return;
    }

    try {
      window.OneSignalDeferred?.push((OneSignal) => {
        OneSignal.Slidedown.promptSms(options).then(() => resolve())
          .catch(error => reject(error));
      });
    } catch (error) {
      reject(error);
    }
  });
}
function slidedownPromptEmail(options?: AutoPromptOptions): Promise<void> {
  return new Promise(function (resolve, reject) {
    if (isOneSignalScriptFailed) {
      reject(new Error('OneSignal script failed to load.'));
      return;
    }

    try {
      window.OneSignalDeferred?.push((OneSignal) => {
        OneSignal.Slidedown.promptEmail(options).then(() => resolve())
          .catch(error => reject(error));
      });
    } catch (error) {
      reject(error);
    }
  });
}
function slidedownPromptSmsAndEmail(options?: AutoPromptOptions): Promise<void> {
  return new Promise(function (resolve, reject) {
    if (isOneSignalScriptFailed) {
      reject(new Error('OneSignal script failed to load.'));
      return;
    }

    try {
      window.OneSignalDeferred?.push((OneSignal) => {
        OneSignal.Slidedown.promptSmsAndEmail(options).then(() => resolve())
          .catch(error => reject(error));
      });
    } catch (error) {
      reject(error);
    }
  });
}
function slidedownAddEventListener(event: SlidedownEventName, listener: (wasShown: boolean) => void): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.Slidedown.addEventListener(event, listener);
  });
  
}
function slidedownRemoveEventListener(event: SlidedownEventName, listener: (wasShown: boolean) => void): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.Slidedown.removeEventListener(event, listener);
  });
  
}
function notificationsSetDefaultUrl(url: string): Promise<void> {
  return new Promise(function (resolve, reject) {
    if (isOneSignalScriptFailed) {
      reject(new Error('OneSignal script failed to load.'));
      return;
    }

    try {
      window.OneSignalDeferred?.push((OneSignal) => {
        OneSignal.Notifications.setDefaultUrl(url).then(() => resolve())
          .catch(error => reject(error));
      });
    } catch (error) {
      reject(error);
    }
  });
}
function notificationsSetDefaultTitle(title: string): Promise<void> {
  return new Promise(function (resolve, reject) {
    if (isOneSignalScriptFailed) {
      reject(new Error('OneSignal script failed to load.'));
      return;
    }

    try {
      window.OneSignalDeferred?.push((OneSignal) => {
        OneSignal.Notifications.setDefaultTitle(title).then(() => resolve())
          .catch(error => reject(error));
      });
    } catch (error) {
      reject(error);
    }
  });
}
function notificationsRequestPermission(): Promise<void> {
  return new Promise(function (resolve, reject) {
    if (isOneSignalScriptFailed) {
      reject(new Error('OneSignal script failed to load.'));
      return;
    }

    try {
      window.OneSignalDeferred?.push((OneSignal) => {
        OneSignal.Notifications.requestPermission().then(() => resolve())
          .catch(error => reject(error));
      });
    } catch (error) {
      reject(error);
    }
  });
}
function notificationsAddEventListener<K extends NotificationEventName>(event: K, listener: (obj: NotificationEventTypeMap[K]) => void): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.Notifications.addEventListener(event, listener);
  });
  
}
function notificationsRemoveEventListener<K extends NotificationEventName>(event: K, listener: (obj: NotificationEventTypeMap[K]) => void): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.Notifications.removeEventListener(event, listener);
  });
  
}
function sessionSendOutcome(outcomeName: string, outcomeWeight?: number): Promise<void> {
  return new Promise(function (resolve, reject) {
    if (isOneSignalScriptFailed) {
      reject(new Error('OneSignal script failed to load.'));
      return;
    }

    try {
      window.OneSignalDeferred?.push((OneSignal) => {
        OneSignal.Session.sendOutcome(outcomeName, outcomeWeight).then(() => resolve())
          .catch(error => reject(error));
      });
    } catch (error) {
      reject(error);
    }
  });
}
function sessionSendUniqueOutcome(outcomeName: string): Promise<void> {
  return new Promise(function (resolve, reject) {
    if (isOneSignalScriptFailed) {
      reject(new Error('OneSignal script failed to load.'));
      return;
    }

    try {
      window.OneSignalDeferred?.push((OneSignal) => {
        OneSignal.Session.sendUniqueOutcome(outcomeName).then(() => resolve())
          .catch(error => reject(error));
      });
    } catch (error) {
      reject(error);
    }
  });
}
function userAddAlias(label: string, id: string): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.User.addAlias(label, id);
  });
  
}
function userAddAliases(aliases: { [key: string]: string }): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.User.addAliases(aliases);
  });
  
}
function userRemoveAlias(label: string): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.User.removeAlias(label);
  });
  
}
function userRemoveAliases(labels: string[]): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.User.removeAliases(labels);
  });
  
}
function userAddEmail(email: string): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.User.addEmail(email);
  });
  
}
function userRemoveEmail(email: string): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.User.removeEmail(email);
  });
  
}
function userAddSms(smsNumber: string): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.User.addSms(smsNumber);
  });
  
}
function userRemoveSms(smsNumber: string): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.User.removeSms(smsNumber);
  });
  
}
function userAddTag(key: string, value: string): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.User.addTag(key, value);
  });
  
}
function userAddTags(tags: { [key: string]: string }): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.User.addTags(tags);
  });
  
}
function userRemoveTag(key: string): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.User.removeTag(key);
  });
  
}
function userRemoveTags(keys: string[]): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.User.removeTags(keys);
  });
  
}
function userGetTags(): { [key: string]: string } {
  let retVal: { [key: string]: string };
  window.OneSignalDeferred?.push((OneSignal) => {
    retVal = OneSignal.User.getTags();
  });
  return retVal;
}
function userAddEventListener(event: 'change', listener: (change: UserChangeEvent) => void): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.User.addEventListener(event, listener);
  });
  
}
function userRemoveEventListener(event: 'change', listener: (change: UserChangeEvent) => void): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.User.removeEventListener(event, listener);
  });
  
}
function userSetLanguage(language: string): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.User.setLanguage(language);
  });
  
}
function userGetLanguage(): string {
  let retVal: string;
  window.OneSignalDeferred?.push((OneSignal) => {
    retVal = OneSignal.User.getLanguage();
  });
  return retVal;
}
function pushSubscriptionOptIn(): Promise<void> {
  return new Promise(function (resolve, reject) {
    if (isOneSignalScriptFailed) {
      reject(new Error('OneSignal script failed to load.'));
      return;
    }

    try {
      window.OneSignalDeferred?.push((OneSignal) => {
        OneSignal.User.PushSubscription.optIn().then(() => resolve())
          .catch(error => reject(error));
      });
    } catch (error) {
      reject(error);
    }
  });
}
function pushSubscriptionOptOut(): Promise<void> {
  return new Promise(function (resolve, reject) {
    if (isOneSignalScriptFailed) {
      reject(new Error('OneSignal script failed to load.'));
      return;
    }

    try {
      window.OneSignalDeferred?.push((OneSignal) => {
        OneSignal.User.PushSubscription.optOut().then(() => resolve())
          .catch(error => reject(error));
      });
    } catch (error) {
      reject(error);
    }
  });
}
function pushSubscriptionAddEventListener(event: 'change', listener: (change: SubscriptionChangeEvent) => void): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.User.PushSubscription.addEventListener(event, listener);
  });
  
}
function pushSubscriptionRemoveEventListener(event: 'change', listener: (change: SubscriptionChangeEvent) => void): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.User.PushSubscription.removeEventListener(event, listener);
  });
  
}
function debugSetLogLevel(logLevel: string): void {
  
  window.OneSignalDeferred?.push((OneSignal) => {
    OneSignal.Debug.setLogLevel(logLevel);
  });
  
}
const PushSubscriptionNamespace: IOneSignalPushSubscription = {
	get id(): string | null | undefined { return window.OneSignal?.User?.PushSubscription?.id; },
	get token(): string | null | undefined { return window.OneSignal?.User?.PushSubscription?.token; },
	get optedIn(): boolean | undefined { return window.OneSignal?.User?.PushSubscription?.optedIn; },
	optIn: pushSubscriptionOptIn,
	optOut: pushSubscriptionOptOut,
	addEventListener: pushSubscriptionAddEventListener,
	removeEventListener: pushSubscriptionRemoveEventListener,
};

const UserNamespace: IOneSignalUser = {
	get onesignalId(): string | undefined { return window.OneSignal?.User?.onesignalId; },
	get externalId(): string | undefined { return window.OneSignal?.User?.externalId; },
	addAlias: userAddAlias,
	addAliases: userAddAliases,
	removeAlias: userRemoveAlias,
	removeAliases: userRemoveAliases,
	addEmail: userAddEmail,
	removeEmail: userRemoveEmail,
	addSms: userAddSms,
	removeSms: userRemoveSms,
	addTag: userAddTag,
	addTags: userAddTags,
	removeTag: userRemoveTag,
	removeTags: userRemoveTags,
	getTags: userGetTags,
	addEventListener: userAddEventListener,
	removeEventListener: userRemoveEventListener,
	setLanguage: userSetLanguage,
	getLanguage: userGetLanguage,
	PushSubscription: PushSubscriptionNamespace,
};

const SessionNamespace: IOneSignalSession = {
	sendOutcome: sessionSendOutcome,
	sendUniqueOutcome: sessionSendUniqueOutcome,
};

const DebugNamespace: IOneSignalDebug = {
	setLogLevel: debugSetLogLevel,
};

const SlidedownNamespace: IOneSignalSlidedown = {
	promptPush: slidedownPromptPush,
	promptPushCategories: slidedownPromptPushCategories,
	promptSms: slidedownPromptSms,
	promptEmail: slidedownPromptEmail,
	promptSmsAndEmail: slidedownPromptSmsAndEmail,
	addEventListener: slidedownAddEventListener,
	removeEventListener: slidedownRemoveEventListener,
};

const NotificationsNamespace: IOneSignalNotifications = {
	get permissionNative(): NotificationPermission { return window.OneSignal?.Notifications?.permissionNative ?? 'default'; },
	get permission(): boolean { return window.OneSignal?.Notifications?.permission ?? false; },
	setDefaultUrl: notificationsSetDefaultUrl,
	setDefaultTitle: notificationsSetDefaultTitle,
	isPushSupported,
	requestPermission: notificationsRequestPermission,
	addEventListener: notificationsAddEventListener,
	removeEventListener: notificationsRemoveEventListener,
};

const OneSignalNamespace: IOneSignalOneSignal = {
	login: oneSignalLogin,
	logout: oneSignalLogout,
	init,
	setConsentGiven: oneSignalSetConsentGiven,
	setConsentRequired: oneSignalSetConsentRequired,
	Slidedown: SlidedownNamespace,
	Notifications: NotificationsNamespace,
	Session: SessionNamespace,
	User: UserNamespace,
	Debug: DebugNamespace,
};

export const useOneSignal = () => {
  return OneSignalNamespace;
}

const OneSignalVuePlugin = {
  install(app: App, options: IInitObject) {
    app.config.globalProperties.$OneSignal = OneSignalNamespace as IOneSignalOneSignal;
    app.config.globalProperties.$OneSignal.init(options);
  }
}

export default OneSignalVuePlugin;
