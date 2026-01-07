/**
 * 分析機能のルート定義
 */

import { AnalysisList } from "./page/AnalysisList";
import { AnalysisNew } from "./page/AnalysisNew";
import { AnalysisResult } from "./page/AnalysisResult";

export const analysisRouteComponents = [
  <AnalysisList path="/" />,
  <AnalysisNew path="/new" />,
  <AnalysisResult path="/result/:id" />,
];
