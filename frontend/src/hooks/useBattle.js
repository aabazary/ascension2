import { useBattleState } from './useBattleState';
import { useBattleAPI } from './useBattleAPI';
import { useBattleActions } from './useBattleActions';

export const useBattle = () => {
  // State management
  const state = useBattleState();
  
  // API calls
  const api = useBattleAPI(
    state.character,
    state.navigate,
    state.setBattleConfig,
    state.setUserData
  );
  
  // Game actions
  const actions = useBattleActions(
    state.battleConfig,
    state.selectedTier,
    state.character,
    state.isPlayerTurn,
    state.gameEnded,
    state.playerHealth,
    state.enemyHealth,
    state.setIsBattleStarted,
    state.setGameEnded,
    state.setBattleResult,
    state.setPlayerHealth,
    state.setEnemyHealth,
    state.maxEnemyHealth,
    state.setSpells,
    state.setCombatLog,
    state.setLogId,
    state.setPlayerHit,
    state.setEnemyHit,
    state.setPlayerAttack,
    state.setEnemyAttack,
    state.setDamageText,
    state.setPlayerProjectiles,
    state.setEnemyProjectiles,
    state.setIsPlayerTurn,
    state.addCombatLog,
    api.submitBattleResult
  );

  return {
    // State
    character: state.character,
    selectedTier: state.selectedTier,
    battleConfig: state.battleConfig,
    isBattleStarted: state.isBattleStarted,
    isPlayerTurn: state.isPlayerTurn,
    gameEnded: state.gameEnded,
    battleResult: state.battleResult,
    playerHealth: state.playerHealth,
    enemyHealth: state.enemyHealth,
    maxPlayerHealth: state.maxPlayerHealth,
    maxEnemyHealth: state.maxEnemyHealth,
    playerHit: state.playerHit,
    enemyHit: state.enemyHit,
    playerAttack: state.playerAttack,
    enemyAttack: state.enemyAttack,
    damageText: state.damageText,
    combatLog: state.combatLog,
    playerProjectiles: state.playerProjectiles,
    enemyProjectiles: state.enemyProjectiles,
    spells: state.spells,
    userData: state.userData,
    
    // Actions
    setSelectedTier: state.setSelectedTier,
    startBattle: actions.startBattle,
    castSpell: actions.castSpell,
    resetBattle: actions.resetBattle,
    handleLogout: api.handleLogout,
    handleProfileUpdated: api.handleProfileUpdated,
    
    // Theme and config
    currentTheme: state.currentTheme,
    tierConfig: state.tierConfig
  };
};
