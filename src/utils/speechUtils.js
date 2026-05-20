export function speakJapanese(text){
    if (!text) return;

    //stop previous speech if already speaking
    //This prevents multiple dialogue lines from overlapping
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "ja-JP";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    //try to select a japanese voice if the browser or device provides one
    //Voice availability depends on the user's browser and operating system
    const voices = window.speechSynthesis.getVoices();

    const japaneseVoice = voices.find(
        (voice) => voice.lang.includes("ja") ||
        voice.name.toLowerCase().includes("japan")
    );

    if(japaneseVoice){
        utterance.voice = japaneseVoice;
    }

    window.speechSynthesis.speak(utterance);
}