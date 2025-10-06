declare type RangeValue<DateType> =
  | [EventValue<DateType>, EventValue<DateType>]
  | null;

export interface IBaseResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface IPaginatedResponse<T = any> {
  success: boolean;
  message: string;
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
  total_pages?: number;
}

export interface ISearchResponse<T = any> extends IPaginatedResponse<T> {
  keyword?: string;
  filters?: Record<string, any>;
}