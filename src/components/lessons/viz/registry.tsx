'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'

// Danh sách đồ thị động dùng được trong bài học: trong Markdown viết `!viz[chú thích](tên)`.
// Mỗi nhóm đồ thị là 1 file riêng, chỉ tải khi bài học có dùng (code splitting); ssr: false vì đồ thị chỉ
// có ý nghĩa khi chạy ở trình duyệt — khung giữ chỗ theo tỉ lệ `ratio` (rộng/cao) để trang không nhảy.
// Lưu ý: next/dynamic yêu cầu viết thẳng import() và object { ssr: false } ở từng chỗ gọi (không gom vào biến).
type Entry = { C: ComponentType; ratio: number }

export const VIZ: Record<string, Entry> = {
  // optimization.tsx
  'gd-learning-rate': { C: dynamic(() => import('./optimization').then((m) => m.GdLearningRate), { ssr: false }), ratio: 640 / 272 },
  'local-minimum': { C: dynamic(() => import('./optimization').then((m) => m.LocalMinimum), { ssr: false }), ratio: 640 / 290 },
  'descent-paths': { C: dynamic(() => import('./optimization').then((m) => m.DescentPaths), { ssr: false }), ratio: 640 / 290 },
  'descent-paths-two': { C: dynamic(() => import('./optimization').then((m) => m.DescentPathsTwo), { ssr: false }), ratio: 640 / 290 },
  'cost-curves': { C: dynamic(() => import('./optimization').then((m) => m.CostCurves), { ssr: false }), ratio: 640 / 285 },
  // statistics.tsx
  'correlation': { C: dynamic(() => import('./statistics').then((m) => m.CorrelationMorph), { ssr: false }), ratio: 640 / 290 },
  'two-tailed-test': { C: dynamic(() => import('./statistics').then((m) => m.TwoTailedTest), { ssr: false }), ratio: 640 / 300 },
  'zscore-bell': { C: dynamic(() => import('./statistics').then((m) => m.ZScoreBell), { ssr: false }), ratio: 640 / 300 },
  'standardization': { C: dynamic(() => import('./statistics').then((m) => m.Standardization), { ssr: false }), ratio: 640 / 250 },
  'boxplot': { C: dynamic(() => import('./statistics').then((m) => m.BoxplotBuild), { ssr: false }), ratio: 640 / 250 },
  // models.tsx
  'poly-fit-error': { C: dynamic(() => import('./models').then((m) => m.PolyFitError), { ssr: false }), ratio: 640 / 290 },
  'poly-fit-house': { C: dynamic(() => import('./models').then((m) => m.PolyFitHouse), { ssr: false }), ratio: 640 / 290 },
  'poly-fit-degrees': { C: dynamic(() => import('./models').then((m) => m.PolyFitDegrees), { ssr: false }), ratio: 640 / 290 },
  'k-fold': { C: dynamic(() => import('./models').then((m) => m.KFold), { ssr: false }), ratio: 640 / 280 },
  'roc-threshold': { C: dynamic(() => import('./models').then((m) => m.RocThreshold), { ssr: false }), ratio: 640 / 290 },
  'regression-fit': { C: dynamic(() => import('./models').then((m) => m.RegressionFit), { ssr: false }), ratio: 640 / 290 },
  'regression-plane-3d': { C: dynamic(() => import('./models').then((m) => m.RegressionPlane3D), { ssr: false }), ratio: 640 / 290 },
  'logistic-sigmoid': { C: dynamic(() => import('./models').then((m) => m.LogisticSigmoid), { ssr: false }), ratio: 640 / 290 },
  'softmax': { C: dynamic(() => import('./models').then((m) => m.SoftmaxBars), { ssr: false }), ratio: 640 / 280 },
  'knn-boundary': { C: dynamic(() => import('./models').then((m) => m.KnnBoundary), { ssr: false }), ratio: 640 / 290 },
  'bias-variance-targets': { C: dynamic(() => import('./models').then((m) => m.BiasVarianceTargets), { ssr: false }), ratio: 640 / 300 },
  'l1-l2-balls': { C: dynamic(() => import('./models').then((m) => m.L1L2Balls), { ssr: false }), ratio: 640 / 295 },
  'shrinkage-functions': { C: dynamic(() => import('./models').then((m) => m.ShrinkageFunctions), { ssr: false }), ratio: 640 / 285 },
  // data.tsx
  'timeseries-fill': { C: dynamic(() => import('./data').then((m) => m.TimeseriesFill), { ssr: false }), ratio: 640 / 270 },
  'dbscan': { C: dynamic(() => import('./data').then((m) => m.DbscanGrow), { ssr: false }), ratio: 640 / 290 },
  'isolation-forest': { C: dynamic(() => import('./data').then((m) => m.IsolationCuts), { ssr: false }), ratio: 640 / 280 },
  'pca': { C: dynamic(() => import('./data').then((m) => m.PcaRotate), { ssr: false }), ratio: 640 / 300 },
  'tsne': { C: dynamic(() => import('./data').then((m) => m.TsneConverge), { ssr: false }), ratio: 640 / 290 },
  // ensemble.tsx
  'bootstrap': { C: dynamic(() => import('./ensemble').then((m) => m.BootstrapDraw), { ssr: false }), ratio: 640 / 300 },
  'bagging-flow': { C: dynamic(() => import('./ensemble').then((m) => m.BaggingFlow), { ssr: false }), ratio: 640 / 290 },
  'random-forest-flow': { C: dynamic(() => import('./ensemble').then((m) => m.RandomForestFlow), { ssr: false }), ratio: 640 / 290 },
  'oob-curve': { C: dynamic(() => import('./ensemble').then((m) => m.OobCurve), { ssr: false }), ratio: 640 / 285 },
  'adaboost-alpha': { C: dynamic(() => import('./ensemble').then((m) => m.AdaboostAlpha), { ssr: false }), ratio: 640 / 290 },
  'gradient-boosting': { C: dynamic(() => import('./ensemble').then((m) => m.GradientBoostingFit), { ssr: false }), ratio: 640 / 290 },
  'shap-waterfall': { C: dynamic(() => import('./ensemble').then((m) => m.ShapWaterfall), { ssr: false }), ratio: 640 / 300 },
  // neural.tsx
  'one-line-not-enough': { C: dynamic(() => import('./neural').then((m) => m.OneLineNotEnough), { ssr: false }), ratio: 640 / 300 },
  'neuron': { C: dynamic(() => import('./neural').then((m) => m.NeuronCompute), { ssr: false }), ratio: 640 / 260 },
  'activation-functions': { C: dynamic(() => import('./neural').then((m) => m.ActivationSweep), { ssr: false }), ratio: 640 / 250 },
  'bias-shift': { C: dynamic(() => import('./neural').then((m) => m.BiasShift), { ssr: false }), ratio: 640 / 290 },
  'forward-pass': { C: dynamic(() => import('./neural').then((m) => m.ForwardPass), { ssr: false }), ratio: 640 / 290 },
  'forward-backward': { C: dynamic(() => import('./neural').then((m) => m.ForwardBackward), { ssr: false }), ratio: 640 / 290 },
  'dropout': { C: dynamic(() => import('./neural').then((m) => m.DropoutNet), { ssr: false }), ratio: 640 / 290 },
  'dl-performance': { C: dynamic(() => import('./neural').then((m) => m.DlPerformance), { ssr: false }), ratio: 640 / 290 },
  'convolution': { C: dynamic(() => import('./neural').then((m) => m.ConvolutionSlide), { ssr: false }), ratio: 640 / 280 },
  'rnn': { C: dynamic(() => import('./neural').then((m) => m.RnnUnroll), { ssr: false }), ratio: 640 / 270 },
  'gan': { C: dynamic(() => import('./neural').then((m) => m.GanDistribution), { ssr: false }), ratio: 640 / 290 },
  'diffusion': { C: dynamic(() => import('./neural').then((m) => m.DiffusionNoise), { ssr: false }), ratio: 640 / 250 },
}
