export function calculateLevelData(totalXP){
    const XP_PER_LEVEL = 100;

    const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;
    const xpIntoLevel = totalXP % XP_PER_LEVEL;
    const progressPercent = (xpIntoLevel / XP_PER_LEVEL) * 100;

    return {
        level,
        xpIntoLevel,
        progressPercent,
        xpNeeded: XP_PER_LEVEL
    };
}