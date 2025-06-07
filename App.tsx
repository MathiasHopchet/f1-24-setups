
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { QueryType, CarSetup, RaceStrategy, ApiResponse, ApiError, TrackOption, TrackGuideResponse, TrackGuide } from './types.ts';
import { F1_TRACKS, WEATHER_CONDITIONS, RACE_LENGTHS, QUERY_TYPES } from './constants.ts';
import { fetchF1Data, fetchTrackGuideData } from './services/GeminiService.ts';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import ErrorDisplay from './components/ErrorDisplay.tsx';
import SetupCard from './components/SetupCard.tsx';
import StrategyCard from './components/StrategyCard.tsx';
import SelectInput from './components/SelectInput.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';

const App: React.FC = () => {
  const [queryType, setQueryType] = useState<QueryType>(QueryType.SETUP);
  const [selectedTrackValue, setSelectedTrackValue] = useState<string>(F1_TRACKS[0].value);
  const [selectedWeather, setSelectedWeather] = useState<string>(WEATHER_CONDITIONS[0].value);
  const [selectedRaceLength, setSelectedRaceLength] = useState<string>(RACE_LENGTHS[0].value);
  const [customRequests, setCustomRequests] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingGuide, setIsLoadingGuide] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [currentTrackGuide, setCurrentTrackGuide] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [guideError, setGuideError] = useState<string | null>(null);

  const isInitialRender = useRef(true); // Tracks if it's the very first render cycle of the app.
  const lastFetchedGuideForTrack = useRef<string | null>(null); // Stores the track value for which guide was last fetched/attempted

  const currentTrackObject = useMemo(() => {
    return F1_TRACKS.find(track => track.value === selectedTrackValue);
  }, [selectedTrackValue]);

  const doFetchTrackGuide = useCallback(async (trackVal: string): Promise<boolean> => {
    if (!trackVal) return false;

    // If guide for this track is already loaded and it's the one we last fetched for, don't re-fetch.
    if (lastFetchedGuideForTrack.current === trackVal && currentTrackGuide) {
        return true; 
    }
    // If we last attempted this track and got an error, don't automatically retry in this flow.
    if (lastFetchedGuideForTrack.current === trackVal && guideError) {
        return false;
    }

    setIsLoadingGuide(true);
    setGuideError(null); 
    // setCurrentTrackGuide(null); // Clear previous guide *only if* it's for a different track or to force refresh.
                                 // For auto-flow, let's clear it to show loading.
    if (lastFetchedGuideForTrack.current !== trackVal) { // Clear if track has changed
        setCurrentTrackGuide(null);
    }


    lastFetchedGuideForTrack.current = trackVal;

    try {
      const guideResponse = await fetchTrackGuideData(trackVal);
      if (guideResponse && 'error' in guideResponse) {
        setGuideError((guideResponse as ApiError).error);
        setCurrentTrackGuide(null);
        return false;
      } else if (guideResponse) {
        setCurrentTrackGuide((guideResponse as TrackGuide).trackGuide);
        setGuideError(null);
        return true;
      }
    } catch (err: any) {
      setGuideError(err.message || 'An unexpected error occurred while fetching track guide.');
      setCurrentTrackGuide(null);
      return false;
    } finally {
      setIsLoadingGuide(false);
    }
    return false; // Should be covered
  }, [setCurrentTrackGuide, setGuideError, setIsLoadingGuide, currentTrackGuide, guideError]);


  const doFetchMainData = useCallback(async () => {
    if (!currentTrackObject) {
      setError("Selected track details could not be found.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setApiResponse(null); // Clear previous main response
    try {
      const response = await fetchF1Data(
        queryType,
        currentTrackObject.value,
        selectedWeather,
        selectedRaceLength,
        customRequests
      );
      if (response && 'error' in response) { setError((response as ApiError).error); } 
      else { setApiResponse(response); }
    } catch (err: any) { setError(err.message || 'An unexpected error occurred.');
    } finally { setIsLoading(false); }
  }, [currentTrackObject, queryType, selectedWeather, selectedRaceLength, customRequests, setIsLoading, setError, setApiResponse]);


  // Effect for initial load and subsequent track/parameter changes
  useEffect(() => {
    const executeFetchFlow = async () => {
      if (!currentTrackObject?.value) return;

      if (isInitialRender.current) {
        // On initial render, only fetch the guide.
        await doFetchTrackGuide(currentTrackObject.value);
        isInitialRender.current = false; 
      } else {
        // Not initial render: a track or other parameter change triggered this.
        // Fetch guide first, then main data.
        const guideSuccess = await doFetchTrackGuide(currentTrackObject.value);
        // Optionally, only fetch main data if guide was successful or if we always want to try
        // For now, let's always try to fetch main data even if guide fails, error will be shown.
        await doFetchMainData();
      }
    };

    executeFetchFlow();
  }, [selectedTrackValue, queryType, selectedWeather, selectedRaceLength, customRequests, currentTrackObject, doFetchTrackGuide, doFetchMainData]);
  // Note: customRequests is included as a dependency to refetch if user types custom requests,
  // same for queryType, selectedWeather, selectedRaceLength.


  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isInitialRender.current) { // If it's still initial (e.g. user clicks submit before track change)
        isInitialRender.current = false; // Mark that we are past the initial auto-guide-fetch phase
    }
    // Manually trigger the full flow
    if (currentTrackObject?.value) {
        await doFetchTrackGuide(currentTrackObject.value);
        await doFetchMainData();
    }
  };

  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTrackValue(e.target.value);
    // Clearing results for responsiveness, useEffect will trigger new fetches.
    setApiResponse(null);
    setError(null);
    // currentTrackGuide and guideError will be reset by doFetchTrackGuide
    if (isInitialRender.current) { // If this is the first user interaction changing the track
        isInitialRender.current = false;
    }
  };
  
  const handleQueryTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQueryType(e.target.value as QueryType);
    setApiResponse(null); // Clear old response when type changes
    setError(null);
    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
  };

  const handleWeatherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWeather(e.target.value);
    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
  };

  const handleRaceLengthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRaceLength(e.target.value);
    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
  };
  
  const handleCustomRequestsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomRequests(e.target.value);
    // We don't set isInitialRender.current to false here, as typing shouldn't alone break the "initial" state
    // for track guide fetching. The main useEffect will pick up the change in customRequests.
  };


  const renderResponse = () => {
    if (!apiResponse || !currentTrackObject) return null;
    if ('error' in apiResponse && apiResponse.error) return null; 

    const responseKey = `${queryType}-${currentTrackObject.value}-${selectedWeather}-${selectedRaceLength}-${customRequests}-${currentTrackGuide ? 'guided' : 'unguided'}`;

    if (queryType === QueryType.SETUP) {
      return <SetupCard 
                key={responseKey} 
                setup={apiResponse as CarSetup} 
                trackImageUrl={currentTrackObject.imageUrl} 
                trackName={currentTrackObject.label}
                trackGuideText={currentTrackGuide} 
             />;
    }
    if (queryType === QueryType.STRATEGY) {
      return <StrategyCard 
                key={responseKey} 
                strategy={apiResponse as RaceStrategy} 
                trackImageUrl={currentTrackObject.imageUrl} 
                trackName={currentTrackObject.label}
                trackGuideText={currentTrackGuide}
             />;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-f1-dark">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <form onSubmit={handleManualSubmit} className="bg-f1-light-dark shadow-2xl rounded-lg p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-semibold text-f1-text mb-6 border-b-2 border-f1-accent-blue pb-2">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <SelectInput
              label="Query Type"
              id="queryType"
              value={queryType}
              options={QUERY_TYPES}
              onChange={handleQueryTypeChange}
            />
            <SelectInput
              label="Track"
              id="track"
              value={selectedTrackValue}
              options={F1_TRACKS}
              onChange={handleTrackChange}
            />
            <SelectInput
              label="Weather Condition"
              id="weather"
              value={selectedWeather}
              options={WEATHER_CONDITIONS}
              onChange={handleWeatherChange}
            />
            {queryType === QueryType.STRATEGY && (
              <SelectInput
                label="Race Length"
                id="raceLength"
                value={selectedRaceLength}
                options={RACE_LENGTHS}
                onChange={handleRaceLengthChange}
              />
            )}
          </div>
          <div className="mt-4">
            <label htmlFor="customRequests" className="block text-sm font-medium text-f1-text-darker mb-1">
              Custom Requests (Optional)
            </label>
            <textarea
              id="customRequests"
              name="customRequests"
              rows={3}
              value={customRequests}
              onChange={handleCustomRequestsChange}
              placeholder="e.g., 'focus on tyre saving', 'aggressive setup for qualifying', 'consider early safety car'"
              className="mt-1 block w-full p-2 text-base bg-gray-700 border-gray-600 focus:outline-none focus:ring-f1-accent-blue focus:border-f1-accent-blue sm:text-sm rounded-md text-f1-text placeholder-f1-text-darker/50"
            />
          </div>
          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={isLoading || isLoadingGuide}
              className="w-full md:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-f1-accent-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-f1-light-dark focus:ring-f1-accent-red transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(isLoadingGuide && !isLoading) ? 'Loading Guide...' : 
               (isLoading && !isLoadingGuide) ? 'Loading Data...' : 
               (isLoading && isLoadingGuide) ? 'Loading All...' : 
               (isLoading || isLoadingGuide) ? 'Loading...' : 
               'Generate Data'}
            </button>
          </div>
        </form>

        {(isLoading || isLoadingGuide) && <LoadingSpinner />}
        {guideError && <ErrorDisplay message={`Track Guide Error: ${guideError}`} />}
        {error && <ErrorDisplay message={`Data Error: ${error}`} />}
        
        {!isLoading && !error && apiResponse && renderResponse()}

        {!isLoading && !isLoadingGuide && !error && !guideError && !apiResponse && !currentTrackGuide && (
            <div className="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-f1-text-darker" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <p className="mt-2 text-lg text-f1-text-darker">
                    Select your parameters and click "Generate Data" to get started.
                </p>
                <p className="mt-1 text-sm text-f1-text-darker/70">
                    AI will craft a custom F1 24 setup or strategy and a detailed track guide for you.
                </p>
            </div>
        )}
        {!isLoading && !error && !apiResponse && currentTrackGuide && (
             <div className="bg-f1-light-dark shadow-xl rounded-lg my-6 animate-fadeIn overflow-hidden">
                 {currentTrackObject?.imageUrl && (
                    <img
                    src={currentTrackObject.imageUrl}
                    alt={`${currentTrackObject.label} Layout`}
                    className="w-full h-72 object-contain object-center rounded-t-lg bg-f1-dark"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                 )}
                 <div className="p-6">
                    <div className="bg-gray-800/50 p-4 rounded-md ring-1 ring-gray-700">
                        <h4 className="text-xl font-semibold text-f1-accent-blue mb-3">Track Guide: {currentTrackObject?.label}</h4>
                        <p className="text-f1-text-darker whitespace-pre-wrap leading-relaxed text-sm">{currentTrackGuide}</p>
                    </div>
                    {!isLoading && !apiResponse && (
                        <p className="text-center mt-6 text-f1-text-darker">Select other parameters or click "Generate Data" for setup or strategy details.</p>
                    )}
                 </div>
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
