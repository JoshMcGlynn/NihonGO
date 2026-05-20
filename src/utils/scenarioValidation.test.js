import { describe, it, expect } from "vitest";
import {isLatinText, isJapaneseText, validateScenario} from "./scenarioValidation";

function createValidScenario(){
    return{
        title: "Restaurant Practice",
        description: "Practice ordering food in Japanese",
        steps: [
            {
                npc: {
                    en: "What would you like?",
                    roma: "nani ni nasaimasu ka?",
                    reading: "なに に なさいますか？",
                    jp: "何になさいますか？"
                },
                choices: [
                    {
                        en: "Beer please.",
                        roma: "Biiru o onegaishimasu",
                        reading: "ビール を おねがいします。",
                        jp: "ビールをお願いします。",
                        correct: true,
                        wrongNpc: {
                            en: "",
                            roma: "",
                            reading: "",
                            jp: ""
                        }
                    },
                    {
                        en: "The bill please.",
                        roma: "okaikei o onegaishimasu",
                        reading: "おかいけ を おねがいします",
                        jp: "お会計をお願いします",
                        correct: false,
                        wrongNpc: {
                            en: "That is too early.",
                            roma: "mada hayai desu",
                            reading: "まだ はやい です",
                            jp: "まだ早いです"
                        }
                    }
                ]
            }
        ]
    };
}
    
    describe("scenarioValidation helper functions", () => {
        it("accepts romaji with macrons", () => {
            expect(isLatinText("chū-jokki  de onegaishimasu")).toBe(true);
        });

        it("accepts plain romaji text", () => {
            expect(isLatinText("chuu jokki de onegaishimasu")).toBe(true);
        });

        it("accepts simple English text", () => {
            expect(isLatinText("Beer please.")).toBe(true);
        });

        it("rejects Japanese characters in Latin/Romaji fields", () => {
            expect(isLatinText("ビールをお願いします。")).toBe(false);
        });

        it("accepts valid Japanese text", () => {
            expect(isJapaneseText("ビールをお願いします。")).toBe(true);
            expect(isJapaneseText("ちゅうジョッキでお願いします。")).toBe(true);
            expect(isJapaneseText("お会計をお願いします。")).toBe(true);
        });

        it("rejects English characters in Japanese fields", () => {
            expect(isJapaneseText("Beer please.")).toBe(false);
        });
    });

    describe("validateScenario", () => {
        it("returns null for a valid scenario", () => {
            const scenario = createValidScenario();

            expect(validateScenario(scenario)).toBe(null);
        });

        it("rejects a scenario with no title", () => {
            const scenario = createValidScenario();
            scenario.title = "";

            expect(validateScenario(scenario)).toBe("Scenario title is required.");
        });

        it("rejects a scenario with no description", () => {
            const scenario = createValidScenario();
            scenario.description = "";

            expect(validateScenario(scenario)).toBe("Scenario description is required.");
        });

        it("rejects a scenario with no steps", () => {
            const scenario = createValidScenario();
            scenario.steps = [];

            expect(validateScenario(scenario)).toBe(
                "A scenario must contain at least one step."
            );
        });

        it("rejects English text in an NPC Japanese field", () => {
            const scenario = createValidScenario();
            scenario.steps[0].npc.jp = "What would you like?";

            expect(validateScenario(scenario)).toBe(
                "Step 1: NPC Japanese must use Japanese characters only."
            );
        });

        it("rejects Japanese text in an NPC English field", () => {
            const scenario = createValidScenario();
            scenario.steps[0].npc.en = "何になさいますか？";

            expect(validateScenario(scenario)).toBe(
                "Step 1: NPC English must use English/Romaji characters only."
            );
        });

        it("rejects a step with fewer than two choices", () => {
            const scenario = createValidScenario();
            scenario.steps[0].choices = [scenario.steps[0].choices[0]];

            expect(validateScenario(scenario)).toBe(
                "Step 1: Each step must have at least two choices."
            );
        });

        it("rejects a step with no correct choice", () => {
            const scenario = createValidScenario();

            scenario.steps[0].choices = scenario.steps[0].choices.map((choice) => ({
                ...choice,
                correct: false
            }));

            expect(validateScenario(scenario)).toBe(
                "Step 1: Each step must have exactly one correct choice."
            );
        });

        it("rejects a step with multiple correct choices", () => {
            const scenario = createValidScenario();
            
            scenario.steps[0].choices = scenario.steps[0].choices.map((choice) => ({
                ...choice, 
                correct: true
            }));

            expect(validateScenario(scenario)).toBe(
                "Step 1: Each step must have exactly one correct choice."
            );
        });

        it("rejects English text in a choice Japanese field", () => {
            const scenario = createValidScenario();
            scenario.steps[0].choices[0].jp = "Beer please.";
            
            expect(validateScenario(scenario)).toBe(
                "Step 1, Choice 1: Japanese must use Japanese characters only."
            );
        });

        it("rejects Japanese text in a choice English field", () => {
            const scenario = createValidScenario();
            scenario.steps[0].choices[0].en = "ビールをお願いします。";

            expect(validateScenario(scenario)).toBe(
                "Step 1, Choice 1: English must use English/Romaji characters only."
            );
        });

        it("allows blank wrong NPC replies", () => {
            const scenario = createValidScenario();

            scenario.steps[0].choices[1].wrongNpc = {
                en: "",
                roma: "",
                reading: "",
                jp: ""
            };

            expect(validateScenario(scenario)).toBe(null);
        });

        it("rejects invalid wrong NPC reply language if filled in", () => {
            const scenario = createValidScenario();

            scenario.steps[0].choices[1].wrongNpc.jp = "That is wrong.";

            expect(validateScenario(scenario)).toBe(
                "Step 1, Choice 2: Wrong reply Japanese must use Japanese characters only."
            );
        });
    });