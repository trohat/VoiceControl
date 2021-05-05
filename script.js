console.log("Voice control script running...");

function VoiceControl() {
    this.items = [
        { RegalId: 'Regál 1', PatroId: 'Patro A', PoziceId: 'Pozice 25', Material: 'Šroub M8', Pocet: 'Počet 12', Jednotka: 'Kusů' },
        { RegalId: 'Regál 3', PatroId: 'Patro C', PoziceId: 'Pozice 21', Material: 'Hadice 6x3 NBR', Pocet: 'Počet 1', Jednotka: 'Kus' },
        { RegalId: 'Regál 4', PatroId: 'Patro B', PoziceId: 'Pozice 13', Material: 'Spona 88.6', Pocet: 'Počet 4', Jednotka: 'Kusů' },
        { RegalId: 'Regál 7', PatroId: 'Patro D', PoziceId: 'Pozice  7', Material: 'Matice 6HR M8 8 galZn', Pocet: 'Počet 12', Jednotka: 'Kusů' }
    ];
    this.keys = ['RegalId', 'PatroId', 'PoziceId', 'Material', 'Pocet', 'Jednotka'];
    this.reader = new SpeechSynthesisUtterance();

    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.speech = new SpeechRecognition();
    this.speech.lang = 'cs-CZ';
    this.speech.onresult = function(e) {
        console.log("Speech recognition result.");
        let result = e.results[0][0].transcript;
        console.log("Tohle je výsledek:", result);
        switch (result.toLowerCase()) {
            case 'znovu':
            case 'opakuj':
                vc.repeat();
                break;
            case 'dál':
            case 'dále':
            case 'další':
                vc.next();
                break;
            case 'stop':
            case 'skonči':
                vc.stop();
                break;
            default:
                console.log("Neznámé slovo.");
        }
    };
    this.speech.onend = this.speech.start;
    this.running = false;
};

VoiceControl.prototype = {
    
    readLine() {
        if (this.position >= this.items.length) this.reader.text = "Konec";
        else {
            this.reader.text = "";
            for (key of this.keys) {
                this.reader.text += this.items[this.position][key];
            }
        }
        speechSynthesis.speak(this.reader);
    },
    
    start() {
        if (!this.running) this.speech.start();
        this.running = true;
        this.position = 0;
        this.readLine();
    },
    
    repeat() {
        speechSynthesis.cancel();
        this.readLine();
    },
    
    next() {
        this.position++;
        speechSynthesis.cancel();
        this.readLine();
    },

    stop() {
        speechSynthesis.cancel();
    },

    setupVoice() {
        const voices = speechSynthesis.getVoices();
        this.reader.voice = voices.find(v => v.lang === "cs-CZ");
    }
};

const vc = new VoiceControl();

speechSynthesis.addEventListener('voiceschanged', () => vc.setupVoice());

const qs_ael = name => {
    const button = document.querySelector('.' + name);
    button.addEventListener('click', () => vc[name]())
};

qs_ael('start');
qs_ael('repeat');
qs_ael('next');
qs_ael('stop');

/* qs_ael is shortcut for this...
const startButton = document.querySelector('.start');
const repeatButton = document.querySelector('.repeat');
const nextButton = document.querySelector('.next');
startButton.addEventListener('click', () => vc.start());
repeatButton.addEventListener('click', () => vc.repeat());
nextButton.addEventListener('click', () => vc.next());
*/