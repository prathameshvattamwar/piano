let synth = new Tone.PolySynth(Tone.Synth).toDestination();
let isPlaying = false;
let isRecording = false;
let recordedNotes = [];
let recordingStartTime = null;
let audio = new Audio();

// Mapping for keyboard keys to piano notes
const keyToNote = {
    'a': 'C4',
    'w': 'C#4',
    's': 'D4',
    'e': 'D#4',
    'd': 'E4',
    'f': 'F4',
    't': 'F#4',
    'g': 'G4',
    'y': 'G#4',
    'h': 'A4',
    'u': 'A#4',
    'j': 'B4'
};

const noteToKey = {
    'C4': 'a',
    'C#4': 'w',
    'D4': 's',
    'D#4': 'e',
    'E4': 'd',
    'F4': 'f',
    'F#4': 't',
    'G4': 'g',
    'G#4': 'y',
    'A4': 'h',
    'A#4': 'u',
    'B4': 'j'
};

// Play/Pause functionality for imported music
document.getElementById('play-pause-btn').addEventListener('click', function () {
    if (isPlaying) {
        audio.pause();
        this.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        audio.play();
        this.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
});

// Handle file input for music upload
document.getElementById('audio-upload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const objectUrl = URL.createObjectURL(file);
        audio.src = objectUrl;
        isPlaying = false;
        document.getElementById('play-pause-btn').innerHTML = '<i class="fas fa-play"></i>';
    }
});

// Volume control
document.getElementById('volume-slider').addEventListener('input', function () {
    audio.volume = this.value;
    synth.volume.value = Tone.gainToDb(this.value); // Adjust synth volume
});

// Instrument mode selection
document.getElementById('voice-mode').addEventListener('change', function () {
    const selectedMode = this.value;
    switch (selectedMode) {
        case 'piano':
            synth = new Tone.PolySynth(Tone.Synth).toDestination();
            break;
        case 'guitar':
            synth = new Tone.PolySynth(Tone.AMSynth).toDestination();
            break;
        case 'flute':
            synth = new Tone.PolySynth(Tone.MonoSynth).toDestination();
            break;
    }
});

// Play sound when key is clicked
const keys = document.querySelectorAll('.key');
keys.forEach(key => {
    key.addEventListener('click', () => {
        const note = key.getAttribute('data-note');
        playSound(note);
        activateKey(key);
        setTimeout(() => deactivateKey(key), 150);
    });
});

// Play sound when a keyboard key is pressed
window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (keyToNote[key]) {
        const pianoKey = document.querySelector(`.key[data-key="${key}"]`);
        if (pianoKey) {
            playSound(keyToNote[key]);
            activateKey(pianoKey);
        }
    }
});

window.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    if (keyToNote[key]) {
        const pianoKey = document.querySelector(`.key[data-key="${key}"]`);
        if (pianoKey) {
            deactivateKey(pianoKey);
        }
    }
});

// Start/Stop Recording
document.getElementById('record-btn').addEventListener('click', () => {
    isRecording = true;
    recordingStartTime = Date.now();
    recordedNotes = [];
    document.getElementById('stop-btn').disabled = false;
    document.getElementById('playback-btn').disabled = true; // Disable playback while recording
});

document.getElementById('stop-btn').addEventListener('click', () => {
    isRecording = false;
    document.getElementById('stop-btn').disabled = true;
    document.getElementById('playback-btn').disabled = false; // Enable playback once recording stops
});

// Function to record and play notes
function playSound(note) {
    synth.triggerAttackRelease(note, '8n');
    if (isRecording) {
        const timeElapsed = Date.now() - recordingStartTime;
        recordedNotes.push({ note, time: timeElapsed });
    }
}

function activateKey(key) {
    if (!key.classList.contains('active')) {
        key.classList.add('active');
    }
}

function deactivateKey(key) {
    if (key.classList.contains('active')) {
        key.classList.remove('active');
    }
}

// Playback recorded notes with visualization
document.getElementById('playback-btn').addEventListener('click', () => {
    playbackNotesWithVisualization();
});

function playbackNotesWithVisualization() {
    recordedNotes.forEach((recordedNote) => {
        setTimeout(() => {
            const keyPressed = noteToKey[recordedNote.note];
            const pianoKey = document.querySelector(`.key[data-key="${keyPressed}"]`);

            if (pianoKey) {
                activateKey(pianoKey);
                playSound(recordedNote.note);
                setTimeout(() => deactivateKey(pianoKey), 150); // Visual effect delay
            }
        }, recordedNote.time);
    });
}