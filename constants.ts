import { TrackOption, QueryType, Option } from './types.ts';

export const API_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';

const placeholderBaseUrl = 'https://placehold.co/800x400/1F2937/E0E0E0/png?text='; // Darker background, lighter text for placeholders

export const F1_TRACKS: TrackOption[] = [
  { value: "Bahrain International Circuit", label: "Bahrain", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit" },
  { value: "Jeddah Street Circuit", label: "Saudi Arabia", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Saudi_Arabia_Circuit" },
  { value: "Albert Park Circuit", label: "Australia", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_771/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Australia_Circuit" },
  { value: "Baku City Circuit", label: "Azerbaijan", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Baku_Circuit" },
  { value: "Miami International Autodrome", label: "Miami", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Miami_Circuit" },
  { value: "Imola Circuit", label: "Emilia Romagna (Imola)", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit" },
  { value: "Circuit de Monaco", label: "Monaco", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Monaco_Circuit" },
  { value: "Circuit de Barcelona-Catalunya", label: "Spain", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Spain_Circuit" },
  { value: "Circuit Gilles Villeneuve", label: "Canada", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Canada_Circuit" },
  { value: "Red Bull Ring", label: "Austria", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Austria_Circuit" },
  { value: "Silverstone Circuit", label: "Great Britain", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Great_Britain_Circuit" },
  { value: "Hungaroring", label: "Hungary", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Hungary_Circuit" },
  { value: "Circuit de Spa-Francorchamps", label: "Belgium", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Belgium_Circuit" },
  { value: "Zandvoort Circuit", label: "Netherlands", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Netherlands_Circuit" },
  { value: "Monza Circuit", label: "Italy (Monza)", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Italy_Circuit" },
  { value: "Marina Bay Street Circuit", label: "Singapore", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit" },
  { value: "Suzuka International Racing Course", label: "Japan", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Japan_Circuit" },
  { value: "Lusail International Circuit", label: "Qatar", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Qatar_Circuit" },
  { value: "Circuit of the Americas", label: "USA (COTA)", imageUrl: "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/USA_Circuit" },
  // Add other tracks from the F1 24 calendar as needed
  { value: "Autódromo Hermanos Rodríguez", label: "Mexico", imageUrl: `${placeholderBaseUrl}Mexico` },
  { value: "Interlagos Circuit", label: "Brazil", imageUrl: `${placeholderBaseUrl}Brazil` },
  { value: "Las Vegas Strip Circuit", label: "Las Vegas", imageUrl: `${placeholderBaseUrl}Las+Vegas` },
  { value: "Yas Marina Circuit", label: "Abu Dhabi", imageUrl: `${placeholderBaseUrl}Abu+Dhabi` },
  { value: "Shanghai International Circuit", label: "China", imageUrl: `${placeholderBaseUrl}China` }
];

export const WEATHER_CONDITIONS: Option[] = [
  { value: "Dry", label: "Dry" },
  { value: "Light Rain", label: "Light Rain / Intermediate" },
  { value: "Heavy Rain", label: "Heavy Rain / Wet" },
  { value: "Dynamic", label: "Dynamic / Mixed" },
];

export const RACE_LENGTHS: Option[] = [
  { value: "5 Laps", label: "5 Laps (Sprint)" },
  { value: "25%", label: "25% Race" },
  { value: "35%", label: "35% Race" },
  { value: "50%", label: "50% Race" },
  { value: "100%", label: "100% Race" },
];

export const QUERY_TYPES: Option[] = [
  { value: QueryType.SETUP, label: "Car Setup" },
  { value: QueryType.STRATEGY, label: "Race Strategy" },
];
