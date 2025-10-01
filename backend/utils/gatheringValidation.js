import { GATHERING_CONFIG } from './gatheringConfig.js';

export const validateGatheringAttempt = (attempt, tier) => {
  const { buttonClicks, timeSpent, startTime, endTime } = attempt;
  const tierConfig = GATHERING_CONFIG.tiers[tier];
  
  if (!tierConfig) {
    return { valid: false, reason: 'Invalid tier configuration' };
  }
  
  // Calculate expected time range based on tier config
  // Minimum: initial delay (1000ms) + at least 1 button interaction
  const minTime = 1000;
  // Maximum: initial delay + (buttons × (window + delay between rounds)) + buffer
  const maxTime = 1000 + (tierConfig.totalButtons * (tierConfig.buttonWindow + 1500)) + 5000;
  
  if (timeSpent < minTime || timeSpent > maxTime) {
    return { valid: false, reason: 'Invalid time duration' };
  }
  
  if (buttonClicks.length !== tierConfig.totalButtons) {
    return { valid: false, reason: `Expected ${tierConfig.totalButtons} button clicks, got ${buttonClicks.length}` };
  }
  
  for (let i = 0; i < buttonClicks.length; i++) {
    const click = buttonClicks[i];
    if (typeof click.clicked !== 'boolean') {
      return { valid: false, reason: `Invalid button click data for button ${i}` };
    }
    if (click.clicked && (!click.clickTime || typeof click.clickTime !== 'number')) {
      return { valid: false, reason: `Invalid click time for button ${i}` };
    }
  }
  
  const now = Date.now();
  if (startTime > now || endTime > now) {
    return { valid: false, reason: 'Invalid timestamps' };
  }
  
  // Allow small timing differences (up to 100ms) due to JS execution timing
  const calculatedTime = endTime - startTime;
  const timeDifference = Math.abs(calculatedTime - timeSpent);
  if (timeDifference > 100) {
    return { valid: false, reason: 'Time mismatch' };
  }
  
  return { valid: true };
};
