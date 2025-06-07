
export enum QueryType {
  SETUP = 'Car Setup',
  STRATEGY = 'Race Strategy',
}

export interface Aerodynamics {
  frontWing: number | string;
  rearWing: number | string;
}

export interface Transmission {
  differentialAdjustmentOnThrottle: number | string;
  differentialAdjustmentOffThrottle: number | string;
}

export interface SuspensionGeometry {
  frontCamber: number | string;
  rearCamber: number | string;
  frontToe: number | string;
  rearToe: number | string;
}

export interface Suspension {
  frontSuspension: number | string;
  rearSuspension: number | string;
  frontAntiRollBar: number | string;
  rearAntiRollBar: number | string;
  frontRideHeight: number | string;
  rearRideHeight: number | string;
}

export interface Brakes {
  brakePressure: number | string;
  frontBrakeBias: number | string;
}

export interface Tyres {
  frontRightTyrePressure: number | string;
  frontLeftTyrePressure: number | string;
  rearRightTyrePressure: number | string;
  rearLeftTyrePressure: number | string;
}

export interface CarSetup {
  track: string;
  condition: string;
  setupName: string;
  // trackGuide?: string; // Removed - will be handled separately
  aerodynamics: Aerodynamics;
  transmission: Transmission;
  suspensionGeometry: SuspensionGeometry;
  suspension: Suspension;
  brakes: Brakes;
  tyres: Tyres;
  notes?: string;
}

export interface StrategyStint {
  tyre: string;
  laps: string;
  pitWindow?: string;
}

export interface RaceStrategy {
  track: string;
  raceLength: string;
  weather: string;
  strategyName:string;
  // trackGuide?: string; // Removed - will be handled separately
  stints: StrategyStint[];
  notes?: string;
}

export interface ApiError {
  error: string;
}

export type ApiResponse = CarSetup | RaceStrategy | ApiError;

export interface Option {
  value: string;
  label: string;
}

export interface TrackOption extends Option {
  imageUrl?: string;
}

// For the dedicated track guide API call
export interface TrackGuide {
    track: string;
    trackGuide: string;
}

export type TrackGuideResponse = TrackGuide | ApiError;
