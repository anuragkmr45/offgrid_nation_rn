// utils/purchases.ts
import { ENTITLEMENT_ID } from "@/constants/AppConstants";
import { RC_IOS_PUBLIC_KEY } from "@/utils/env";
import { Platform } from "react-native";
import Purchases, {
  CustomerInfo,
  PURCHASES_ERROR_CODE,
  PurchasesOffering,
} from "react-native-purchases";

let rcConfigured = false;

/** Configure RevenueCat (iOS only) and optionally log in the user */
export async function configurePurchases(userId?: string) {
  if (Platform.OS !== "ios") return;
  if (!rcConfigured) {
    await Purchases.configure({ apiKey: RC_IOS_PUBLIC_KEY });
    rcConfigured = true;
  }
  if (userId) {
    await Purchases.logIn(userId);
  }
}

/** Get the current RC customer snapshot (used for UI + backend sync) */
export async function getCustomerInfo(): Promise<CustomerInfo> {
  return Purchases.getCustomerInfo();
}

/** Map RC periodType (string-ish) → strict union used by backend payload */
function mapPeriodType(
  pt: string | null | undefined
): "TRIAL" | "INTRO" | "NORMAL" {
  const up = (pt ?? "NORMAL").toString().toUpperCase();
  if (up === "TRIAL") return "TRIAL";
  if (up === "INTRO") return "INTRO";
  return "NORMAL";
}

/**
 * Build a backend-ready snapshot with STRICT types:
 * - periodType normalized to "TRIAL" | "INTRO" | "NORMAL"
 * - store coerced to "APP_STORE" (string) for iOS
 */
export function snapshotEntitlements(info: CustomerInfo) {
  const active = info.entitlements?.active || {};

  const activeEntitlements = Object.values(active).map((e: any) => ({
    id: e?.identifier,
    isActive: !!e?.isActive,
    willRenew: !!e?.willRenew,
    periodType: mapPeriodType(e?.periodType), // normalized
    latestPurchaseDate: e?.latestPurchaseDate,
    originalPurchaseDate: e?.originalPurchaseDate,
    expirationDate: e?.expirationDate,
    productId: e?.productIdentifier,
    store: "APP_STORE" as const, // string (not enum)
    isSandbox: !!e?.isSandbox,
    unsubscribeDetectedAt: e?.unsubscribeDetectedAt ?? null,
    billingIssueDetectedAt: e?.billingIssueDetectedAt ?? null,
  }));

  return {
    rcAppUserId: info.originalAppUserId ?? null,
    activeSubscriptions: info.activeSubscriptions ?? [],
    allPurchasedProductIds: info.allPurchasedProductIdentifiers ?? [],
    latestExpirationDate: info.latestExpirationDate ?? null,
    requestDate: info.requestDate,
    managementURL: info.managementURL ?? null,
    activeEntitlements,
  };
}

/** Current offering (iOS only) */
export async function getCurrentOffering(): Promise<PurchasesOffering | null> {
  if (Platform.OS !== "ios") return null;
  const offerings = await Purchases.getOfferings();
  return offerings.current ?? null;
}

/** Purchase the default package from the current offering and return CustomerInfo */
export async function purchaseDefaultPackage(): Promise<CustomerInfo> {
  const offering = await getCurrentOffering();
  const pkg = offering?.availablePackages?.[0];
  if (!pkg) throw new Error("No package configured in current offering");

  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo;
  } catch (e: any) {
    // Treat user cancellation as a benign signal
    const userCancelled =
      e?.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR ||
      e?.userCancelled === true ||
      String(e?.message ?? "").toUpperCase().includes("CANCEL");
    if (userCancelled) {
      throw new Error("USER_CANCELLED");
    }
    throw e;
  }
}

/** Restore purchases and return CustomerInfo */
export async function restorePurchases(): Promise<CustomerInfo> {
  const info = await Purchases.restorePurchases();
  return info;
}

/** Check if "pro" entitlement is active */
export function isPro(info: CustomerInfo) {
  return !!info.entitlements?.active?.[ENTITLEMENT_ID];
}

/** Subscribe to RC customer info updates */
export function addCustomerInfoListener(cb: (info: CustomerInfo) => void) {
  Purchases.addCustomerInfoUpdateListener(cb);
}

/** Log out of RevenueCat (call on app logout/user switch) */
export async function logoutPurchases() {
  if (Platform.OS !== "ios") return;
  try {
    await Purchases.logOut();
  } catch {
    // no-op
  }
}
