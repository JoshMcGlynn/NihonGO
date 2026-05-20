export function calculateLevelData(totalXP){
    //The current system requires 100XP per level
    //This can be changed here any time without altering the rest of the app
    const XP_PER_LEVEL = 100;

    //Level 1 starts at 0XP, so 100XP becomes level 2
    const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;

    //XP earned within the current level
    //e.g. 1450XP = level 15, 50XP to the next level
    const xpIntoLevel = totalXP % XP_PER_LEVEL;

    //Converted into a percentage so it can be used directly by progress bar
    const progressPercent = (xpIntoLevel / XP_PER_LEVEL) * 100;

    return {
        level,
        xpIntoLevel,
        progressPercent,
        xpNeeded: XP_PER_LEVEL
    };
}