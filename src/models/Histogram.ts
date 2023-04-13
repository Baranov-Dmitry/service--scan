interface AnalyticsIntervalPoint {
  date: string;
  value: number;
}

export interface AnalyticsHistogramData {
  data: AnalyticsIntervalPoint[];
  histogramType: "totalDocuments" | "riskFactors";
}

export interface SearchResultItem {
  encodedId: string;
  influence: number;
  similarCount: number;
}

export interface ScanDoc {
  ok: {
    schemaVersion: string;
    id: string;
    version: number;
    issueDate: string;
    url: string;
    source: DocumentSource;
    dedupClusterId: string;
    title: DocumentTitle;
    content: DocumentContent;
    attributes: DocumentAttributes;
    language: "Russian" | "other" | "unknown";
  };
}

export interface Fail {
  fail: {
    errorCode: string;
    errorMessage: string;
  };
}

interface DocumentSource {
  id: number;
  name: string;
  categoryId: number;
  levelId: number;
  groupId: number;
}

interface DocumentTitle {
  text: string;
  markup: string;
}

interface DocumentContent {
  markup: string;
}

interface DocumentAttributes {
  isTechNews: boolean;
  isAnnouncement: boolean;
  isDigest: boolean;
  wordCount: number;
}

export type loadingState = "idle" | "pending" | "succeeded" | "failed";
