declare module "react-native-sentiance" {
  import { EventSubscriptionVendor, NativeEventEmitter, EmitterSubscription } from "react-native";

  export type SdkInitState = "NOT_INITIALIZED" | "INIT_IN_PROGRESS" | "INITIALIZED" | "RESETTING" | "UNRECOGNIZED_STATE";

  export type SdkResetFailureReason = "SDK_INIT_IN_PROGRESS" | "SDK_RESET_IN_PROGRESS" | "SDK_RESET_UNKNOWN_ERROR";

  export type InitIssue = "INVALID_CREDENTIALS" | "CHANGED_CREDENTIALS" | "SERVICE_UNREACHABLE" | "LINK_FAILED" | "SDK_RESET_IN_PROGRESS" | "INITIALIZATION_ERROR";

  export type VehicleMode = "IDLE" | "VEHICLE" | "NOT_VEHICLE" | "UNKNOWN";

  export type TripType = "TRIP_TYPE_SDK" | "TRIP_TYPE_EXTERNAL";

  export enum TransportMode {
    UNKNOWN = 1,
    CAR,
    BICYCLE,
    ON_FOOT,
    TRAIN,
    TRAM,
    BUS,
    PLANE,
    BOAT,
    METRO,
    RUNNING,
  }

  export interface SdkStatus {
    startStatus: string;
    canDetect: boolean;
    isRemoteEnabled: boolean;
    isLocationPermGranted: boolean;
    isAccelPresent: boolean;
    isGyroPresent: boolean;
    isGpsPresent: boolean;
    wifiQuotaStatus: string;
    mobileQuotaStatus: string;
    diskQuotaStatus: string;
    isBgAccessPermGranted?: boolean; // iOS only
    isActivityRecognitionPermGranted?: boolean; // Android only
    locationSetting?: string; // Android only
    isAirplaneModeEnabled?: boolean; // Android only
    isLocationAvailable?: boolean; // Android only
    isGooglePlayServicesMissing?: boolean; // Android only
    isBatteryOptimizationEnabled?: boolean; // Android only
    isBatterySavingEnabled?: boolean; // Android only
    isBackgroundProcessingRestricted?: boolean; // Android only
  }

  export interface UserAccessToken {
    tokenId: string;
    expiryDate?: string; // Android only
  }

  export interface MetadataObject {
    [key: string]: string;
  }

  export interface TripInfo {
    type: "TRIP_TYPE_SDK" | "TRIP_TYPE_EXTERNAL" | "TRIP_TYPE_UNRECOGNIZED" | "ANY";
  }

  export interface Location {
    latitude: string;
    longitude: string;
    accuracy?: string; // Android only
    altitude?: string; // Android only
    provider?: string; // Android only
  }

  export interface StationaryInfo {
    location?: Location;
  }

  export interface UserActivity {
    type: "USER_ACTIVITY_TYPE_TRIP" | "USER_ACTIVITY_TYPE_STATIONARY" | "USER_ACTIVITY_TYPE_UNKNOWN" | "USER_ACTIVITY_TYPE_UNRECOGNIZED";
    tripInfo?: TripInfo;
    stationaryInfo?: StationaryInfo;
  }

  export interface TripProfileConfig {
    enableFullProfiling: boolean;
    speedLimit?: number;
  }

  export interface CrashEvent {
    time: number;
    lastKnownLocation?: Location;
  }

  export interface VehicleCrashEvent {
    time: number;
    location?: Location;
    magnitude?: number;
    speedAtImpact?: number;
    deltaV?: number;
    confidence?: number;
  }

  export interface HardEvent {
    magnitude: number;
    timestamp: number;
  }

  export interface TransportSegments {
    startTime: number;
    endTime: number;
    distance?: number;
    averageSpeed?: number;
    topSpeed?: number;
    percentOfTimeSpeeding?: number;
    vehicleMode: VehicleMode;
    hardEvents: HardEvent[];
  }

  export interface TripProfile {
    tripId: string;
    transportSegments: TransportSegments[];
  }

  export type SdkEvent = "SDKStatusUpdate" | "SDKUserLink" | "SDKUserActivityUpdate" | "SDKCrashEvent" | "SDKTripProfile" | "SDKTripTimeout" | "VehicleCrashEvent";

  export type SDKStatusUpdateListener = (sdkStatus: SdkStatus) => void;

  export type SDKUserLinkListener = (param: { installId: string }) => void;

  export type SDKUserActivityUpdateListener = (userActivity: UserActivity) => void;

  export type SDKCrashEventListener = (crashEvent: CrashEvent) => void;

  export type SDKTripProfileListener = (tripProfile: TripProfile) => void;

  export type SdkEventListener =
    SDKStatusUpdateListener |
    SDKUserLinkListener |
    SDKUserActivityUpdateListener |
    SDKCrashEventListener |
    SDKTripProfileListener;

  export interface RNSentianceConstructor extends EventSubscriptionVendor {
    init(
      appId: string,
      secret: string,
      baseURL: string | null,
      shouldStart: boolean
    ): Promise<boolean | SdkStatus>;
    initWithUserLinkingEnabled(
      appId: string,
      secret: string,
      baseURL: string | null,
      shouldStart: boolean
    ): Promise<boolean | SdkStatus>;
    start(): Promise<SdkStatus>;
    startWithStopDate(stopEpochTimeMs: number): Promise<SdkStatus>;
    stop(): Promise<boolean>;
    reset(): Promise<boolean>;
    getInitState(): Promise<SdkInitState>;
    getSdkStatus(): Promise<SdkStatus>;
    getVersion(): Promise<string>;
    getUserId(): Promise<string>;
    getUserAccessToken(): Promise<UserAccessToken>;
    addUserMetadataField(label: string, value: string): Promise<boolean>;
    addUserMetadataFields(metadata: MetadataObject): Promise<boolean>;
    removeUserMetadataField(label: string): Promise<boolean>;
    getWiFiQuotaLimit(): Promise<string>;
    getWiFiQuotaUsage(): Promise<string>;
    getMobileQuotaLimit(): Promise<string>;
    getMobileQuotaUsage(): Promise<string>;
    getDiskQuotaLimit(): Promise<string>;
    getDiskQuotaUsage(): Promise<string>;
    disableBatteryOptimization(): Promise<boolean>;
    getUserActivity(): Promise<UserActivity>;
    listenUserActivityUpdates(): Promise<boolean>;
    listenCrashEvents(): Promise<boolean>;
    listenTripProfiles(): Promise<boolean>;
    updateTripProfileConfig(config: TripProfileConfig): Promise<boolean>;
    userLinkCallback(success: boolean): void;
    getValueForKey(key: string, defaultValue: string): Promise<string>;
    setValueForKey(key: string, value: string): void;
    startTrip(metadata: MetadataObject|null, hint: TransportMode): Promise<boolean>;
    stopTrip(): Promise<boolean>;
    isTripOngoing(type: TripType): Promise<boolean>;
    submitDetections(): Promise<boolean>;
    updateSdkNotification(title: string, message: string): Promise<boolean>;
    addTripMetadata(metadata: MetadataObject): Promise<boolean>;
    isNativeInitializationEnabled(): Promise<boolean>;
    enableNativeInitialization(): Promise<boolean>;
    disableNativeInitialization(): Promise<boolean>;
    listenVehicleCrashEvents(): Promise<boolean>;
    invokeDummyVehicleCrash(): Promise<boolean>;
    isVehicleCrashDetectionSupported(type: TripType): Promise<boolean>;
  }

  export interface RNSentianceEventEmitter extends NativeEventEmitter {
    addListener(eventType: SdkEvent, listener: SdkEventListener, context?: any): EmitterSubscription;
  }

  export interface RNSentianceEventSubscriptions {
    sdkStatusSubscription?: EmitterSubscription;
    sdkUserLinkSubscription?: EmitterSubscription;
    sdkUserActivityUpdateSubscription?: EmitterSubscription;
    sdkCrashEventSubscription?: EmitterSubscription;
    sdkTripProfileListener?: EmitterSubscription;
  }

  const RNSentiance: RNSentianceConstructor;
  export default RNSentiance;
}
