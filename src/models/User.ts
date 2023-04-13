export interface User extends AccessData, eventFiltersInfo {
  id: string;
  name: string;
  countUsage: number;
  counterLimit: number;
}

export interface AccessData {
  accessToken: string;
  expire: string;
}

export interface eventFiltersInfo {
  eventFiltersInfo:
    | {
        usedCompanyCount: number;
        companyLimit: number;
      }
    | undefined;
  loadingInfo: "idle" | "pending" | "succeeded" | "failed";
  error: undefined | string;
}
