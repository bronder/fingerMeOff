// Audio Engine using Web Audio API
class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.currentTimeout = null;
    }

    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        // Resume context if suspended (browser autoplay policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Convert MIDI note number to frequency
    midiToFrequency(midi) {
        return 440 * Math.pow(2, (midi - 69) / 12);
    }

    // Play a single note
    playNote(frequency, duration = 0.3, startTime = 0) {
        if (!this.audioContext) this.init();
        
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        // Use a warm tone (triangle + sine blend)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime + startTime);
        
        // ADSR envelope
        const now = this.audioContext.currentTime + startTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.5, now + 0.02); // Attack
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.1);  // Decay
        gainNode.gain.linearRampToValueAtTime(0.3, now + duration - 0.1); // Sustain
        gainNode.gain.linearRampToValueAtTime(0, now + duration); // Release
        
        osc.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        osc.start(now);
        osc.stop(now + duration);
    }

    // Play a scale string by string
    async playScale(positions, tempo = 'medium') {
        if (this.isPlaying) {
            this.stop();
            return;
        }

        this.init();
        this.isPlaying = true;

        // Tempo settings (ms per note)
        const tempoMap = {
            slow: 500,
            medium: 300,
            fast: 180
        };
        const noteDuration = tempoMap[tempo] || 300;
        const stringPause = noteDuration; // Pause between strings

        // Group positions by string (string 0 = Low E, string 5 = high e)
        const stringGroups = {};
        positions.forEach(pos => {
            if (!stringGroups[pos.string]) {
                stringGroups[pos.string] = [];
            }
            stringGroups[pos.string].push(pos);
        });

        // Sort each string's notes by fret position
        Object.keys(stringGroups).forEach(string => {
            stringGroups[string].sort((a, b) => a.fret - b.fret);
        });

        // Play string by string (0 to 5 = Low E to high e)
        const stringOrder = [0, 1, 2, 3, 4, 5];
        
        for (const stringNum of stringOrder) {
            if (!this.isPlaying) return;
            const stringNotes = stringGroups[stringNum];
            if (!stringNotes) continue;

            for (const pos of stringNotes) {
                if (!this.isPlaying) return;
                this.playNote(this.midiToFrequency(pos.midi), noteDuration / 1000 * 0.8);
                await this.delay(noteDuration);
            }

            // Small pause between strings
            if (stringNum < 5) {
                await this.delay(stringPause / 2);
            }
        }

        if (!this.isPlaying) return;

        // Short pause at end
        await this.delay(noteDuration);

        // Play descending (high e to Low E)
        for (let i = stringOrder.length - 1; i >= 0; i--) {
            if (!this.isPlaying) return;
            const stringNum = stringOrder[i];
            const stringNotes = stringGroups[stringNum];
            if (!stringNotes) continue;

            // Play in reverse fret order
            for (let j = stringNotes.length - 1; j >= 0; j--) {
                if (!this.isPlaying) return;
                const pos = stringNotes[j];
                this.playNote(this.midiToFrequency(pos.midi), noteDuration / 1000 * 0.8);
                await this.delay(noteDuration);
            }

            // Small pause between strings
            if (stringNum > 0) {
                await this.delay(stringPause / 2);
            }
        }

        this.isPlaying = false;
    }

    // Stop playback
    stop() {
        this.isPlaying = false;
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
        }
    }

    // Helper delay function
    delay(ms) {
        return new Promise(resolve => {
            this.currentTimeout = setTimeout(resolve, ms);
        });
    }

    // Play a single note on click/hover (for interactive feedback)
    playNoteClick(frequency) {
        this.init();
        this.playNote(frequency, 0.3);
    }
}

// Global audio engine instance
const audioEngine = new AudioEngine();
