export let recognition:SpeechRecognition;

export const startSpeechRecognition = () => {
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition !== undefined) {
        recognition = new SpeechRecognition();
    }
}
