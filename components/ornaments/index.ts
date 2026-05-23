// Barrel for the 5-category ornament library. Each file is a single SVG
// or stamp ornament. Routes/ (large endurance route SVGs) is built during
// Phase 4 when the /endurance/ page lands.

export { catClasses, CAT_HEX, type TagCategory, type CatClasses } from './catClass';

export { OrnRevStamp }      from './OrnRevStamp';
export { OrnLED }           from './OrnLED';
export { OrnSchematic }     from './OrnSchematic';
export { PAHomeSchematic }  from './PAHomeSchematic';

export { OrnSparkline }     from './OrnSparkline';
export { OrnCommitGrid }    from './OrnCommitGrid';
export { OrnTenure, type TenureItem } from './OrnTenure';
export { OrnCursor }        from './OrnCursor';

export { OrnBakeCurve }     from './OrnBakeCurve';
export { OrnCrossSection }  from './OrnCrossSection';
export { OrnThumbStamp }    from './OrnThumbStamp';

export { OrnDropcap }       from './OrnDropcap';
export { OrnPullQuote }     from './OrnPullQuote';
export { OrnReadingMeter }  from './OrnReadingMeter';

export { OrnEndurance, type EnduranceKind } from './OrnEndurance';
export { OrnCompassRose }   from './OrnCompassRose';
export { ContourBackground } from './ContourBackground';

// Large route SVGs for /endurance/ trophy spreads.
export { RouteWhitney }     from './routes/RouteWhitney';
export { RouteTioga }       from './routes/RouteTioga';
export { RouteIronman }     from './routes/RouteIronman';
