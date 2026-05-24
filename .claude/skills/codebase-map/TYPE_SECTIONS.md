# Type Sections — MandatorSettings

> **Auto-generated** by `npm run generate:codebase-map` — do not edit manually.

**File**: `packages/business/src/types/MandatorSettings.ts` (2243 lines)
**Interface starts**: line 343

## Top-Level Sections

These are direct properties of `MandatorSettings`. Use these line numbers to jump to the section you need.

| Section | Type | Line |
|---------|------|------|
| `APP` | `App` | L344 |
| `AI_ASSISTANCE` | `{ ... }` | L345 |
| `DEVELOPMENT` | `DevelopmentMandatorSettings` | L350 |
| `STREAM_3D` | `Stream3D` | L351 |
| `DISCLAIMER` | `Disclaimer` | L352 |
| `LINKS` | `Links` | L353 |
| `CONFIG_EXTENSION` | `ConfigExtension` | L354 |
| `CONFLICT` | `Conflict` | L355 |
| `LINE_CONFLICT` | `{ ... }` | L356 |
| `RFX` | `Rfx` | L360 |
| `DEALER_CONFIGS` | `DealerConfigs` | L361 |
| `DATA_STRUCTURES` | `DataStructures` | L362 |
| `DATEPICKER_CONFIG` | `DatePickerItem[]` | L363 |
| `COOKIE_CONFIG` | `CookieConfig` | L364 |
| `CAROUSEL_CONFIGS` | `{ ... }` | L365 |
| `HORIZONTAL_TILE_CONFIGS` | `{ ... }` | L369 |
| `RECOMMENDATION` | `Recommendation` | L372 |
| `EQUIPMENTS` | `Equipments` | L373 |
| `PACKAGES_AND_OPTIONS` | `PackagesAndOptions` | L374 |
| `SIMILARITY_SEARCH` | `{ ... }` | L375 |
| `NAVIGATION` | `{ ... }` | L383 |
| `EMISSION` | `{ ... }` | L407 |
| `ENGINEDATA` | `{ ... }` | L495 |
| `ERROR` | `{ ... }` | L500 |
| `FINANCIAL` | `{ ... }` | L513 |
| `INITIAL_REDUCED_CONFIGURE_STREAM` | `boolean` | L598 |
| `CONFIGURE_STREAM` | `{ ... }` | L599 |
| `PRODUCT_DATA` | `{ ... }` | L617 |
| `LINES_SELECTION` | `{ ... }` | L763 |
| `ENGINE_SELECTION` | `{ ... }` | L784 |
| `RANGE_SELECTION` | `{ ... }` | L810 |
| `BASIC_EQUIPMENT` | `{ ... }` | L813 |
| `WALLET` | `Wallet` | L821 |
| `HEADER` | `{ ... }` | L822 |
| `FOOTER` | `{ ... }` | L860 |
| `STICKY_SIDEBAR` | `{ ... }` | L869 |
| `GARAGE` | `{ ... }` | L873 |
| `COOKIE_REMEMBER_LAST_CONFIG` | `{ ... }` | L877 |
| `CATEGORIES_MAPPING` | `{ ... }` | L883 |
| `AUTOMATIC_TRANSMISSION_ORDER` | `string[]` | L917 |
| `STAGE_CONTROLS` | `ConStageControls` | L918 |
| `STAGE` | `Stage` | L919 |
| `VISUALIZATION` | `Stage & { ... }` | L920 |
| `STAGE_VIEW` | `View` | L925 |
| `ACCESSORIES` | `{ ... }` | L926 |
| `SUMMARY_PAGE` | `{ ... }` | L941 |
| `PRINT_PAGE` | `PrintPageSettings` | L961 |
| `CONFIG_ID` | `{ ... }` | L962 |
| `NEXT_STEPS` | `{ ... }` | L970 |
| `INITIAL_CONFIG` | `{ ... }` | L975 |
| `WARNINGS_CONFIG` | `{ ... }` | L980 |
| `TOAST_BARS_CONFIG` | `ToastBarsConfig` | L1034 |
| `NOTIFICATION_CENTER` | `{ ... }` | L1035 |
| `PRECON_OPTIONAL_INFO_BANNER` | `{ ... }` | L1040 |
| `PUB_SUB_MESSENGER` | `{ ... }` | L1043 |
| `MODEL_RANGES_PAGE` | `{ ... }` | L1054 |
| `MODEL_MATRIX` | `{ ... }` | L1068 |
| `IMAGES` | `{ ... }` | L1074 |
| `MODALS` | `ModalSettings` | L1124 |
| `MODULAR_MODALS_SETTINGS` | `{ ... }` | L1125 |
| `MODULAR_CONFIGURE_STREAM` | `{ ... }` | L1129 |
| `MODULAR_COMPONENTS` | `{ ... }` | L1159 |
| `MODULAR_SGT_NODES_MODAL` | `{ ... }` | L1176 |
| `BESPOKE` | `{ ... }` | L1181 |
| `EXPERT_MODE` | `{ ... }` | L1187 |
| `VSS` | `{ ... }` | L1204 |
| `SIMPLE_VEHICLE_SEARCH` | `{ ... }` | L1216 |
| `CHARM` | `{ ... }` | L1277 |
| `PGE` | `{ ... }` | L1281 |
| `SALES_FOOTER` | `{ ... }` | L1284 |
| `SALES_BAR` | `{ ... }` | L1296 |
| `SALES_BAR_OVERLAY` | `{ ... }` | L1299 |
| `ACCESSORY_BOUTIQUE` | `AccessoryBoutique` | L1302 |
| `TELEMETRY` | `{ ... }` | L1303 |
| `SLIDER_VIEW` | `{ ... }` | L1309 |
| `INSPIRED_SPECS` | `{ ... }` | L1312 |
| `TRACKING` | `{ ... }` | L1315 |

## Other Interfaces in This File

| Interface / Type | Line |
|------------------|------|
| `Overwrites` | L59 |
| `DeviceModeSettings` | L85 |
| `LinkElement` | L96 |
| `SettingsExtensionSchema` | L174 |
| `PriceDetails` | L190 |
| `ControlBarBackgrounds` | L211 |
| `PreConfiguredVehiclesComponent` | L218 |
| `TelemetryGlobalSettings` | L228 |
| `TelemetryServiceSettings` | L239 |
| `WebTracingInstrumentationServiceSettings` | L246 |
| `MetricsServiceSettings` | L258 |
| `HeaderSectionSettings` | L266 |
| `FooterSectionSettings` | L273 |
| `ModularModalContentSettings` | L278 |
| `DescriptionSectionSettings` | L280 |
| `MediaSectionSettings` | L286 |
| `ModalContentSectionDefinition` | L290 |
| `LayoutConfigurationItem` | L296 |
| `LoggingInstrumentation` | L302 |
| `DiscountCampaignLabels` | L304 |
| `DeliveryTimeRangeLabelSettings` | L310 |
| `AccessoriesVisualizationSettings` | L334 |
| `AccessoryCategoriesVisualizationSettings` | L339 |
| `SortContextMenuItem` | L1322 |
| `SortContextMenuItem` | L1329 |
| `SortContextMenuItem` | L1336 |
| `CompactSalesBar` | L1344 |
| `Stage` | L1351 |
| `Structure` | L1373 |
| `View` | L1380 |
| `VehicleView` | L1427 |
| `ModularSgtSettings` | L1433 |
| `ModularHeader` | L1535 |
| `ModularHeaderOrderPerPage` | L1558 |
| `ModularHeaderNodeType` | L1563 |
| `ModularHeaderNodeSettings` | L1576 |
| `ModuleSettings` | L1595 |
| `ModuleParams` | L1610 |
| `App` | L1614 |
| `Stream3D` | L1828 |
| `sgtViewpoint` | L1835 |
| `cameraViewpoint` | L1841 |
| `DevelopmentMandatorSettings` | L1846 |
| `DevelopmentLoggerSettings` | L1880 |
| `Disclaimer` | L1888 |
| `Links` | L1895 |
| `ConfigExtension` | L1899 |
| `Conflict` | L1909 |
| `Rfx` | L1920 |
| `DealerConfigs` | L1967 |
| `ExpertBarItem` | L1980 |
| `DatePickerItem` | L1988 |
| `ExpertBarItems` | L1995 |
| `Eve` | L1997 |
| `DataStructures` | L2004 |
| `DataElementGroupItem` | L2012 |
| `DataElementGroup` | L2036 |
| `DataElement` | L2051 |
| `CookieLink` | L2069 |
| `Cookie` | L2076 |
| `CookieConfig` | L2084 |
| `Recommendation` | L2101 |
| `Equipments` | L2114 |
| `Classifier` | L2132 |
| `Wallet` | L2146 |
| `PackagesAndOptions` | L2155 |
| `PaginatorSettings` | L2175 |
| `AccessoryBoutique` | L2192 |
| `EcoBonusEligibility` | L2205 |
| `EcoBonusScope` | L2206 |
| `EcoBonusScrapping` | L2207 |
| `CompareModalConfig` | L2209 |
| `ToastBarTypeConfig` | L2214 |
| `ToastBarNotification` | L2222 |
| `ToastBarsConfig` | L2224 |
| `Views` | L2234 |
| `ModelNameConfig` | L2236 |

## Backend Base Type Imports

These types are composed into `MandatorSettings` from `@conx/backend-elements`:

| Type | Import Path |
|------|-------------|
| `AccessoriesBaseSettings` | `@conx/backend-elements/types/AccessoriesBaseSettings` |
| `ClassifiersBaseSettings` | `@conx/backend-elements/types/ClassifiersBaseSettings` |
| `ColoursBaseSettings` | `@conx/backend-elements/types/ColoursBaseSettings` |
| `CosyBaseSettings` | `@conx/backend-elements/types/CosyBaseSettings` |
| `DigitalBrochureBaseSettings` | `@conx/backend-elements/types/DigitalBrochureBaseSettings` |
| `EmsBaseSettings` | `@conx/backend-elements/types/EmsBaseSettings` |
| `EveControlBaseSettings` | `@conx/backend-elements/types/EveControlBaseSetting` |
| `GarageBaseSettings` | `@conx/backend-elements/types/GarageBaseSettings` |
| `GcdmBaseSettings` | `@conx/backend-elements/types/GcdmBaseSettings` |
| `LocalisationBaseSettings` | `@conx/backend-elements/types/LocalisationBaseSettings` |
| `OtdBaseSettings` | `@conx/backend-elements/types/OtdBaseSettings` |
| `PgeBaseSettings` | `@conx/backend-elements/types/PgeBaseSettings` |
| `PricingBaseSettings` | `@conx/backend-elements/types/PricingBaseSettings` |
| `RulesolverBaseSettings` | `@conx/backend-elements/types/RulesolverBaseSettings` |
| `Stream3dBaseSettings` | `@conx/backend-elements/types/Stream3dBaseSettings` |
| `TelemetryBaseSettings` | `@conx/backend-elements/types/TelemetryBaseSettings` |
| `VehicleTreeBaseSettings` | `@conx/backend-elements/types/VehicleTreeBaseSettings` |
| `VssBaseSettings` | `@conx/backend-elements/types/VssBaseSettings` |
| `StoloDataServiceBaseSettings` | `@conx/backend-elements/types/stolo-data-service/StoloDataService` |
| `CampaignDataSettings` | `@conx/backend-elements/types/CampaignDataSettings` |
| `BaseSettings` | `@conx/backend-elements/types/BaseSettings` |
| `UcpBaseSettings` | `@conx/backend-elements/types/UcpBaseSettings` |
| `FaaSBaseSettings` | `@conx/backend-elements/types/FaaSBaseSettings` |

## Key Utility Functions

| Function | Package | Purpose |
|----------|---------|---------|
| `findProperty(obj, path, default)` | `@conx/shared-helpers` | Safe deep property read |
| `createProperty(obj, path, value)` | `@conx/shared-helpers` | Safe deep property write |
| `mergeProperty(target, source)` | `@conx/shared-helpers` | Deep merge with operators (`:prepend`, `:append`, `:remove`, `:extract`, `:delete`, `:merge`) |
| `deleteProperty(obj, path)` | `@conx/shared-helpers` | Safe deep property delete |
