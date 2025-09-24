import { GATHERING_CONFIG } from './gatheringConfig.js';

export const validateGatheringAttempt = (attempt, tier) => {
  const { buttonClicks, timeSpent, startTime, endTime } = attempt;
  const tierConfig = GATHERING_CONFIG.tiers[tier];
  
  if (!tierConfig) {
    return { valid: false, reason: 'Invalid tier configuration' };
  }
  
  if (timeSpent < 10000 || timeSpent > 20000) {
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
  
  if (endTime - startTime !== timeSpent) {
    return { valid: false, reason: 'Time mismatch' };
  }
  
  return { valid: true };
};
