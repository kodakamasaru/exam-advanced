/**
 * 分析API
 */

import { get, post } from "../../lib";
import type {
  AnalysisListItem,
  Analysis,
  CreateAnalysisRequest,
  CreateAnalysisResponse,
} from "./types";

const BASE_PATH = "/analyses";

/**
 * 分析履歴一覧取得
 */
export const getAnalyses = (): Promise<AnalysisListItem[]> => {
  return get<AnalysisListItem[]>(BASE_PATH);
};

/**
 * 分析結果取得
 */
export const getAnalysis = (id: string): Promise<Analysis> => {
  return get<Analysis>(`${BASE_PATH}/${id}`);
};

/**
 * 分析実行
 */
export const createAnalysis = (
  data: CreateAnalysisRequest
): Promise<CreateAnalysisResponse> => {
  return post<CreateAnalysisResponse, CreateAnalysisRequest>(BASE_PATH, data);
};

/**
 * CSVダウンロードURL取得
 */
export const getCsvDownloadUrl = (id: string): string => {
  return `/api${BASE_PATH}/${id}/csv`;
};
