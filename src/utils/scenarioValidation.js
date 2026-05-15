export function isLatinText(value){
    const latinRegex = /^[A-Za-z0-9āīūēōĀĪŪĒŌ\s.,!?'"()\-:;]+$/;
    return latinRegex.test(value.trim());
}

export function isJapaneseText(value){
    const japaneseRegex = 
        /^[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9faf\u3000-\u303f0-9\s。、！？ー・（）「」『』]+$/;

        return japaneseRegex.test(value.trim());
}

export function validateScenario(scenarioData){
    if(!scenarioData.title.trim()){
        return "Scenario title is required.";
    }

    if(!scenarioData.description.trim()){
        return "Scenario description is required.";
    }

    if(scenarioData.steps.length === 0){
        return "A scenario must contain at least one step.";
    }

    for(let i = 0; i < scenarioData.steps.length; i++){
        const step = scenarioData.steps[i];

        if(!step.npc.en.trim() || !isLatinText(step.npc.en)){
            return `Step ${i + 1}: NPC English must use English/Romaji characters only.`;
        }

        if(!step.npc.roma.trim() || !isLatinText(step.npc.roma)){
            return `Step ${i + 1}: NPC Romaji must use English/Romaji characters only.`;
        }

        if(!step.npc.reading.trim() || !isJapaneseText(step.npc.reading)){
            return `Step ${i + 1}: NPC reading must use Japanese characters only.`;
        }

        if(!step.npc.jp.trim() || !isJapaneseText(step.npc.jp)){
            return `Step ${i + 1}: NPC Japanese must use Japanese characters only.`;
        }

        const choices = step.choices || [];

        if(choices.length < 2){
            return `Step ${i + 1}: Each step must have at least two choices.`;
        }

        const correctChoices = choices.filter((choice) => choice.correct);

        if(correctChoices.length !== 1){
            return `Step ${i + 1}: Each step must have exactly one correct choice.`;
        }

        for(let j = 0; j < choices.length; j++){
            const choice = choices[j];

            if(!choice.en.trim() || !isLatinText(choice.en)){
                return `Step ${i + 1}, Choice ${j + 1}: English must use English/Romaji characters only.`;
            }

            if(!choice.roma.trim() || !isLatinText(choice.roma)){
                return `Step ${i + 1}, Choice ${j + 1}: Romaji must use English/Romaji characters only.`;
            }

            if(!choice.reading.trim() || !isJapaneseText(choice.reading)){
                return `Step ${i + 1}, Choice ${j + 1}: Reading must use Japanese characters only.`;
            }

            if(!choice.jp.trim() || !isJapaneseText(choice.jp)){
                return `Step ${i + 1}, Choice ${j + 1}: Japanese must use Japanese characters only.`;
            }

            //NPC reply validation, will only validate fields if the user actually typed something into them, so blank fields are allowed and will return the default wrong reply dialogue
            if(!choice.correct && choice.wrongNpc){
                if(choice.wrongNpc.en.trim() && !isLatinText(choice.wrongNpc.en)){
                    return `Step ${i + 1}, Choice ${j + 1}: Wrong reply English must use English/Romaji characters only.`;
                }

                if(choice.wrongNpc.roma.trim() && !isLatinText(choice.wrongNpc.roma)){
                    return `Step ${i + 1}, Choice ${j + 1}: Wrong reply Romaji must use English/Romaji characters only.`;
                }

                if(choice.wrongNpc.reading.trim() && !isJapaneseText(choice.wrongNpc.reading)){
                    return `Step ${i + 1}, Choice ${j + 1}: Wrong reply reading must use Japanese characters only.`;
                }

                if(choice.wrongNpc.jp.trim() && !isJapaneseText(choice.wrongNpc.jp)){
                    return `Step ${i + 1}, Choice ${j + 1}: Wrong reply Japanese must use Japanese characters only.`;
                }
            }
        }
    }

    return null;
}