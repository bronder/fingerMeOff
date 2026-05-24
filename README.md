# ScaleMaster - Guitar Scale Learning App

An interactive guitar scale learning tool with visual fretboard display and audio playback.

## Features

- **Interactive Fretboard**: Visual representation of the guitar neck with color-coded notes
- **Multiple Scales**: Support for Major, Minor, Modes (Dorian, Phrygian, Lydian, Mixolydian, Locrian), Pentatonic, and Exotic scales
- **Scale Patterns**: Pre-defined scale patterns for Major, Minor, and Phrygian
- **Audio Playback**: Play scales string-by-string with adjustable tempo (slow, medium, fast)
- **Click-to-Play**: Click any note on the fretboard to hear it
- **Key Selection**: Choose any key from C to B
- **Scale Information**: Display of scale formula and interval names
- **Local Storage**: Your preferences (key, scale, tempo) are saved

## How to Use

1. Open `index.html` in a web browser
2. Select a **Key** (e.g., C)
3. Select a **Scale** (e.g., Major)
4. Click **Play Scale** to hear the scale played string-by-string
5. Click individual note dots to hear specific notes
6. Adjust **Tempo** (slow, medium, fast) to change playback speed
7. Use the **Octave Range** dropdown to view different sections of the neck

## File Structure

- `index.html` - Main HTML structure
- `styles.css` - Styling for the fretboard and UI
- `app.js` - Main application logic
- `audio.js` - Web Audio API audio engine
- `scales.js` - Scale definitions and guitar string configurations

## Scale Patterns

The app includes these scale patterns:
- **Major Patterns**: Pattern 1, Pattern 2 (3NPS)
- **Minor Patterns**: Minor Pattern 1, Minor Pattern 2 (3NPS)
- **Phrygian Patterns**: Phrygian Pattern 1

## Audio

The app uses the Web Audio API to generate synthesized guitar tones. Notes are calculated using MIDI values for accurate pitch representation across the full range of the guitar neck.

## Browser Compatibility

Works best in modern browsers (Chrome, Firefox, Safari, Edge) with Web Audio API support.
