export interface SearchState {
  dates: {
    startDate: string;
    startDateError: boolean;
    endDate: string;
    endDateError: boolean;
  };
  inn: {
    text: string;
    error: boolean;
  };
  tonality: SelectTonality;
  limit: number;
  isCountErr: boolean;
  inBusinessNews: boolean;
  maxFullness: boolean;
  onlyMainRole: boolean;
  onlyWithRiskFactors: boolean;
  excludeTechNews: boolean;
  excludeAnnouncements: boolean;
  excludeDigests: boolean;
}

export type SelectTonality = "any" | "negative" | "positive";
