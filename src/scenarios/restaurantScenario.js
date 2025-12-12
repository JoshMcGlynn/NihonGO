export const restaurantScenario = {
  id: "restaurant-ordering",
  title: "Ordering at a Restaurant",
  description: "Learn how to order drinks and food in a casual Japanese restaurant.",
  steps: [
    {
      npc: {
        kanji: "ご注文は何になさいますか？",
        kana: "ごちゅうもん は なに に なさいますか？",
        romaji: "gochūmon wa nani ni nasaimasu ka?",
        english: "What would you like to order?"
      },
      options: [
        {
          id: 1,
          kanji: "生ビールを一つください。",
          isCorrect: true,
          npcResponse: {
            kanji: "かしこまりました！生ビールですね。",
            english: "Certainly! One draft beer."
          }
        },
        {
          id: 2,
          kanji: "ビールを一つください。",
          isCorrect: true,
          npcResponse: {
            kanji: "ビールですね！かしこまりました。",
            english: "A beer? Certainly!"
          }
        },
        {
          id: 3,
          kanji: "帰ります。",
          isCorrect: false,
          npcResponse: {
            kanji: "え？もう帰りますか？ご注文はありませんか？",
            english: "Huh? You're leaving already? No order?"
          },
          action: "repeat_step"
        },
        {
          id: 4,
          kanji: "お会計お願いします。",
          isCorrect: false,
          npcResponse: {
            kanji: "え？まだ何もご注文されていませんが…？",
            english: "You haven't ordered anything yet…"
          },
          action: "repeat_step"
        }
      ]
    },
    {
      npc: {
        kanji: "おつまみはいかがなさいますか？",
        kana: "おつまみ は いかが なさいますか？",
        romaji: "otsumami wa ikaga nasaimasu ka?",
        english: "Would you like any side dishes?"
      },
      options: [
        {
          id: 1,
          kanji: "枝豆をお願いします。",
          isCorrect: true,
          npcResponse: {
            kanji: "枝豆ですね。かしこまりました。",
            english: "Edamame? Certainly."
          }
        },
        {
          id: 2,
          kanji: "唐揚げをください。",
          isCorrect: true,
          npcResponse: {
            kanji: "唐揚げですね。承知しました！",
            english: "Karaage? Understood!"
          }
        },
        {
          id: 3,
          kanji: "飲み物だけで大丈夫です。",
          isCorrect: true,
          npcResponse: {
            kanji: "かしこまりました。では飲み物だけですね。",
            english: "Understood — just the drink then."
          }
        },
        {
          id: 4,
          kanji: "はい。",
          isCorrect: false,
          npcResponse: {
            kanji: "はい…？おつまみをご注文されますか？",
            english: "Yes…? Would you like to order something?"
          },
          action: "repeat_step"
        }
      ]
    },
    {
      npc: {
        kanji: "ご注文は以上でよろしいでしょうか？",
        kana: "ごちゅうもん は いじょう で よろしいでしょうか？",
        romaji: "gochūmon wa ijō de yoroshii deshou ka?",
        english: "Will that be everything?"
      },
      options: [
        {
          id: 1,
          kanji: "はい、以上です。",
          isCorrect: true,
          npcResponse: {
            kanji: "ありがとうございます！すぐにお持ちします。",
            english: "Thank you! I'll bring it right away."
          }
        },
        {
          id: 2,
          kanji: "あとでまた頼みます。",
          isCorrect: true,
          npcResponse: {
            kanji: "承知しました。ごゆっくりどうぞ。",
            english: "Understood — please take your time."
          }
        },
        {
          id: 3,
          kanji: "すみません、もう帰ります。",
          isCorrect: false,
          npcResponse: {
            kanji: "え…？ご注文されたばかりですが…？",
            english: "Huh? You just ordered though…?"
          },
          action: "repeat_step"
        }
      ]
    }
  ]
};