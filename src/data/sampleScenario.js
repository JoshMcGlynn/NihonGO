export const sampleScenario = {
  id: "restaurant-beer",
  title: "Ordering a Beer at a Restaurant",
  description: "Practice ordering a drink politely in a Japanese restaurant.",
  steps: [
    {
      npc: {
        jp: "ご注文は何になさいますか？",
        reading: "ごちゅうもんは なにに なさいますか？",
        roma: "go-chūmon wa nani ni nasaimasu ka?",
        en: "What would you like to order?"
      },
      choices: [
        {
          jp: "生ビールを一つください。",
          reading: "なまビールを ひとつ ください。",
          roma: "nama bīru o hitotsu kudasai.",
          en: "One draft beer, please.",
          correct: true,
        },
        {
          jp: "お会計お願いします。",
          reading: "おかいけい おねがいします。",
          roma: "okaikei onegai shimasu.",
          en: "The bill, please.",
          correct: false,
          wrongNpc: {
            jp: "え？もうお会計ですか？",
            reading: "え？もう おかいけいですか？",
            roma: "eh? mō okaikei desu ka?",
            en: "Huh? Are you already asking for the bill?"
          }
        },
        {
          jp: "日本酒をください。",
          reading: "にほんしゅを ください。",
          roma: "nihonshu o kudasai.",
          en: "Sake, please.",
          correct: false,
          wrongNpc: {
            jp: "申し訳ありません。ビールのご注文をお伺いしています。",
            reading: "もうしわけありません。ビールの ごちゅうもんを おうかがいしています。",
            roma: "mōshiwake arimasen. bīru no go-chūmon o ukagatte imasu.",
            en: "Sorry, I'm asking about a beer order."
          }
        }
      ]
    },
    {
      npc: {
        jp: "かしこまりました。サイズはいかがなさいますか？",
        reading: "かしこまりました。 サイズは いかが なさいますか？",
        roma: "kashikomarimashita. saizu wa ikaga nasaimasu ka?",
        en: "Certainly. What size would you like?"
      },
      choices: [
        {
          jp: "中ジョッキでお願いします。",
          reading: "ちゅうジョッキで おねがいします。",
          roma: "chū-jokki de onegai shimasu.",
          en: "Medium size, please.",
          correct: true,
        },
        {
          jp: "特にいりません。",
          reading: "とくに いりません。",
          roma: "toku ni irimasen.",
          en: "I don't need it.",
          correct: false,
          wrongNpc: {
            jp: "サイズをお伺いしています。",
            reading: "サイズを おうかがいしています。",
            roma: "saizu o oukagatte imasu.",
            en: "I was asking about the size."
          }
        },
        {
          jp: "グラスでお願いいたします。",
          reading: "グラスで おねがいいたします。",
          roma: "gurasu de onegai itashimasu.",
          en: "A glass, please.",
          correct: false,
          wrongNpc: {
            jp: "申し訳ありません。サイズをお伺いしています。",
            reading: "もうしわけありません。サイズを おうかがいしています。",
            roma: "mōshiwake arimasen. saizu o ukagatte imasu.",
            en: "Sorry, I was asking about the size of the glass."
          }
        }
      ]
    },
    {
      npc: {
        jp: "ありがとうございます。すぐにお持ちします！",
        reading: "ありがとうございます。 すぐに おもちします！",
        roma: "arigatou gozaimasu. sugu ni omochi shimasu!",
        en: "Thank you! I'll bring it out right away!"
      },
      choices: [
        {
          jp: "お願いします！",
          reading: "おねがいします！",
          roma: "onegai shimasu!",
          en: "Please do!",
          correct: true
        },
        {
          jp: "違います！",
          reading: "ちがいます！",
          roma: "chigaimasu!",
          en: "That's wrong!",
          correct: false,
          wrongNpc: {
            jp: "え？何が違いますか？",
            reading: "え？なにが ちがいますか？",
            roma: "eh? nani ga chigaimasu ka?",
            en: "Huh? What is wrong?"
          }
        },
        {
          jp: "遅いです。",
          reading: "おそいです。",
          roma: "osoi desu.",
          en: "You're slow.",
          correct: false,
          wrongNpc: {
            jp: "申し訳ありませんが、その言い方は少し失礼です。",
            reading: "もうしわけありませんが、その いいかたは すこし しつれいです。",
            roma: "mōshiwake arimasen ga, sono iikata wa sukoshi shitsurei desu.",
            en: "Sorry, but that phrasing is a bit rude."
          }
        }
      ]
    }
  ]
};