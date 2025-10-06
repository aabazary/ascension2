// Utility functions for character data transformation

/**
 * Transform resources from array format (backend) to object format (frontend)
 * This matches the Character model's toJSON method
 * @param {Array} resourcesArray - Array of resource objects from backend
 * @returns {Object} - Object with resources organized by type and tier
 */
export const transformResources = (resourcesArray) => {
  const resourcesObj = {
    gathering: {},
    minion: {},
    boss: {}
  };
  
  if (resourcesArray && Array.isArray(resourcesArray)) {
    resourcesArray.forEach(resource => {
      if (resourcesObj[resource.type]) {
        resourcesObj[resource.type][resource.tier] = resource.count;
      }
    });
  }
  
  return resourcesObj;
};

/**
 * Merge partial character data from backend with existing character data
 * @param {Object} existingCharacter - Current character object
 * @param {Object} partialCharacter - Partial character data from backend
 * @returns {Object} - Merged character object
 */
export const mergeCharacterData = (existingCharacter, partialCharacter) => {
  return {
    ...existingCharacter,
    stats: partialCharacter.stats,
    resources: transformResources(partialCharacter.resources)
  };
};
