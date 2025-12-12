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
          wrongNpc: "あ、違いますね。こちらのメニューをもう一度ご覧ください。"
        },
        {
          jp: "お会計お願いします。",
          reading: "おかいけい おねがいします。",
          roma: "okaikei onegai shimasu.",
          en: "The bill, please.",
          correct: false,
          wrongNpc: "え？もうお会計ですか？ご注文をお伺いしますね。"
        },
        {
          jp: "日本酒をください。",
          reading: "にほんしゅを ください。",
          roma: "nihonshu o kudasai.",
          en: "Sake, please.",
          correct: false,
          wrongNpc: "申し訳ありません、生ビールのご注文をお伺いしています。"
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
          wrongNpc: "すみません、中ジョッキをおすすめしていますよ。"
        },
        {
          jp: "特にいりません。",
          reading: "とくに いりません。",
          roma: "toku ni irimasen.",
          en: "I don't need it.",
          correct: false,
          wrongNpc: "サイズをお伺いしないとご用意できません。"
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
        }
      ]
    }
  ]
};