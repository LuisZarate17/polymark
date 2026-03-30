import { Router } from 'express';
import { PositionManager } from '../trading/position';
import { AnalyticsTracker } from '../analyzer/tracker';
declare const positionManager: PositionManager;
declare const analyticsTracker: AnalyticsTracker;
export declare const createPositionRoutes: () => Router;
export { positionManager, analyticsTracker };
//# sourceMappingURL=positions.d.ts.map