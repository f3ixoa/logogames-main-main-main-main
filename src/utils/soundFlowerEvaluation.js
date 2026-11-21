export const evaluateSoundFlowerAttempt = ({
  mode,
  targetMatched = false,
  voiceDetected = false,
  technicalError = '',
  noiseFloorRms = 0,
  voiceReferenceRms = 0,
  peakRms = 0,
  meanVoicedRms = 0,
  segments = []
}) => {
  if (technicalError) return { passed: false, acousticPass: false, technicalError, diagnosticReason: 'technical-error' };
  if (!voiceDetected) return { passed: false, acousticPass: false, diagnosticReason: 'no-voiced-signal' };
  if (!targetMatched) return { passed: false, acousticPass: false, diagnosticReason: 'target-not-recognized' };

  const hasSessionReference = voiceReferenceRms > noiseFloorRms;
  const referenceRange = Math.max(0, voiceReferenceRms - noiseFloorRms);
  // First voiced attempt establishes a provisional session baseline. Until then, use
  // gates scaled from measured ambient floor rather than device-independent RMS values.
  const loudThreshold = hasSessionReference
    ? noiseFloorRms + referenceRange * 0.75
    : noiseFloorRms * 6;
  const softThreshold = hasSessionReference
    ? noiseFloorRms + referenceRange * 0.45
    : noiseFloorRms * 3.2;
  const loudPass = peakRms >= loudThreshold;
  const softPass = meanVoicedRms <= softThreshold && peakRms > noiseFloorRms * 2.2;
  const shortCount = segments.filter((segment, index) => segment.duration >= 45 && segment.duration <= 350
    && (index === 0 || segment.start - segments[index - 1].end >= 90)).length;
  const longPass = segments.some((segment) => segment.duration >= 1000);
  const acousticPass = mode === 'loud' ? loudPass
    : mode === 'soft' ? softPass
      : mode === 'short' ? shortCount >= 3
        : longPass;

  return {
    passed: acousticPass,
    acousticPass,
    diagnosticReason: acousticPass ? 'pass'
      : mode === 'loud' ? 'below-adaptive-loud-threshold'
        : mode === 'soft' ? 'above-adaptive-soft-threshold'
          : mode === 'short' ? 'not-enough-distinct-short-segments'
            : 'no-sustained-segment',
    loudThresholdRms: loudThreshold,
    softThresholdRms: softThreshold,
    shortSegmentCount: shortCount
  };
};
