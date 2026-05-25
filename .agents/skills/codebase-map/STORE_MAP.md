# Store Map

> **Auto-generated** by `npm run generate:codebase-map` — do not edit manually.

## Overview

| Enum | Store Key | Class | State Type | Purpose |
|------|-----------|-------|------------|---------|
| `STATE_APP` | `stateApp` | `StateApp` | `ApplicationState` | Settings that state the current status of the session with the User. (decisions, device, etc.) |
| `STATE_UCP` | `stateUcp` | `StateUcp` | `UcpState` | Settings that have been cached and calculated from request to the backend services. |
| `STATE_VEHICLE` | `stateVehicle` | `StateVehicle` | `VehicleState` | Settings specific to the Current configuration. (Gets reconstructed on every change to the vehicle.) |
| `STATE_RESOURCES` | `stateResource` | `StateResource` | `ResourceState` | Resources available at this part of the configurator. |

## Store Details

### STATE_APP (`stateApp`)

- **Class**: `StateApp` in `packages/business/src/stores/stateApp.ts`
- **State type**: `ApplicationState` from `packages/business/src/types/ApplicationState.ts`
- **Purpose**: Settings that state the current status of the session with the User. (decisions, device, etc.)
- **Key fields**:
  - `accessoriesEnabled?: boolean`
  - `accessoryData?: AccessoriesData`
  - `active?: boolean`
  - `appReleaseVersion?: string`
  - `active360Overlay?: { active: boolean, isInterior: boolean }`
  - `autoResolveConflicts?: boolean`
  - `bestMatchApplied?: boolean`
  - `configurationReverted: boolean`
  - `configureMenuItems?: Array<{ firstChildNode?: string; hidden?: boolean; name: string; nodeCode: string; isTranslated?:boolean; }>`
  - `categoryHeaderHeights?: Array<{ nodeCode: string; height: number; }>`
  - `datesOverwrites?: DateOverwrites`
  - `deviceMode?: DeviceMode`
  - `filterUncolouredOptionsAnchor?: boolean`
  - `optionsWithoutColour?: string[]`
  - `fullscreenMenuActive?: unknown`
  - _...and 68 more_

### STATE_UCP (`stateUcp`)

- **Class**: `StateUcp` in `packages/business/src/stores/stateUcp.ts`
- **State type**: `UcpState` from `packages/business/src/types/UcpState.ts`
- **Purpose**: Settings that have been cached and calculated from request to the backend services.
- **Key fields**:
  - `primaryModelCodes?: Set<string>`
  - `availableCombinations?: VehicleCombination[]`
  - `availableLines?: Record<string, Line>`
  - `availableModels?: Record<string, Model>`
  - `availableOptions?: string[]`
  - `hiddenOptions?: string[]`
  - `availablePackages?: string[]`
  - `availableProvinces?: string[]`
  - `optionsColours?: Record<string, Record<string, Colour>>`
  - `availableOptionsColours?: Record<string, Record<string, AvailableColorListingDetails>>`
  - `invalidColourOptionsResponse?: InvalidColourOptionsResponse`
  - `classifiedConfiguration?: ClassifiedConfiguration`
  - `configurationHistory?: ConfigurationStep[]`
  - `configurationState?: string`
  - `currentGcdmSavedConfiguration?: CurrentGcdmSavedConfiguration`
  - _...and 37 more_

### STATE_VEHICLE (`stateVehicle`)

- **Class**: `StateVehicle` in `packages/business/src/stores/stateVehicle.ts`
- **State type**: `VehicleState` from `packages/business/src/stores/stateVehicle.ts`
- **Purpose**: Settings specific to the Current configuration. (Gets reconstructed on every change to the vehicle.)
- **Key fields**:
  - `classifiedConfiguration?: ClassifiedConfiguration`

### STATE_RESOURCES (`stateResource`)

- **Class**: `StateResource` in `packages/business/src/stores/stateResource.ts`
- **State type**: `ResourceState` from `packages/business/src/types/ResourceState.ts`
- **Purpose**: Resources available at this part of the configurator.
- **Key fields**:
  - `settings?: MandatorSettings`
  - `localisation?: Localisations`

## Usage Patterns

```typescript
// Read-only subscription (component re-renders on store change)
@readStore('stateApp')
declare stateApp: ApplicationState;

// Read-write subscription (component can also dispatch updates)
@useStore('stateResource')
declare stateResource: ResourceState;
```
