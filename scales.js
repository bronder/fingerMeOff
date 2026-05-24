// Guitar Scale Definitions
// Each scale has: name, intervals (semitones from root), formula display

const SCALES = {
    // Basic Scales
    major: {
        name: 'Major (Ionian)',
        intervals: [0, 2, 4, 5, 7, 9, 11],
        formula: '1 - 2 - 3 - 4 - 5 - 6 - 7',
        category: 'Basic'
    },
    minor: {
        name: 'Natural Minor (Aeolian)',
        intervals: [0, 2, 3, 5, 7, 8, 10],
        formula: '1 - 2 - b3 - 4 - 5 - b6 - b7',
        category: 'Basic'
    },
    
    // Modes
    ionian: {
        name: 'Ionian Mode',
        intervals: [0, 2, 4, 5, 7, 9, 11],
        formula: '1 - 2 - 3 - 4 - 5 - 6 - 7',
        category: 'Modes'
    },
    dorian: {
        name: 'Dorian Mode',
        intervals: [0, 2, 3, 5, 7, 9, 10],
        formula: '1 - 2 - b3 - 4 - 5 - 6 - b7',
        category: 'Modes'
    },
    phrygian: {
        name: 'Phrygian Mode',
        intervals: [0, 1, 3, 5, 7, 8, 10],
        formula: '1 - b2 - b3 - 4 - 5 - b6 - b7',
        category: 'Modes'
    },
    lydian: {
        name: 'Lydian Mode',
        intervals: [0, 2, 4, 6, 7, 9, 11],
        formula: '1 - 2 - 3 - #4 - 5 - 6 - 7',
        category: 'Modes'
    },
    mixolydian: {
        name: 'Mixolydian Mode',
        intervals: [0, 2, 4, 5, 7, 9, 10],
        formula: '1 - 2 - 3 - 4 - 5 - 6 - b7',
        category: 'Modes'
    },
    aeolian: {
        name: 'Aeolian Mode',
        intervals: [0, 2, 3, 5, 7, 8, 10],
        formula: '1 - 2 - b3 - 4 - 5 - b6 - b7',
        category: 'Modes'
    },
    locrian: {
        name: 'Locrian Mode',
        intervals: [0, 1, 3, 5, 6, 8, 10],
        formula: '1 - b2 - b3 - 4 - b5 - b6 - b7',
        category: 'Modes'
    },
    
    // Pentatonics
    majorPenta: {
        name: 'Major Pentatonic',
        intervals: [0, 2, 4, 7, 9],
        formula: '1 - 2 - 3 - 5 - 6',
        category: 'Pentatonic'
    },
    minorPenta: {
        name: 'Minor Pentatonic',
        intervals: [0, 3, 5, 7, 10],
        formula: '1 - b3 - 4 - 5 - b7',
        category: 'Pentatonic'
    },
    
    // Exotic Scales
    harmonicMinor: {
        name: 'Harmonic Minor',
        intervals: [0, 2, 3, 5, 7, 8, 11],
        formula: '1 - 2 - b3 - 4 - 5 - b6 - 7',
        category: 'Exotic'
    },
    melodicMinor: {
        name: 'Melodic Minor',
        intervals: [0, 2, 3, 5, 7, 9, 11],
        formula: '1 - 2 - b3 - 4 - 5 - 6 - 7',
        category: 'Exotic'
    },
    phrygianDominant: {
        name: 'Phrygian Dominant',
        intervals: [0, 1, 4, 5, 7, 8, 10],
        formula: '1 - b2 - 3 - 4 - 5 - b6 - b7',
        category: 'Exotic'
    },
    wholeTone: {
        name: 'Whole Tone',
        intervals: [0, 2, 4, 6, 8, 10],
        formula: '1 - 2 - 3 - #4 - #5 - #6',
        category: 'Exotic'
    },
    diminished: {
        name: 'Diminished (W-H)',
        intervals: [0, 2, 3, 5, 6, 8, 9, 11],
        formula: '1 - 2 - b3 - 4 - b5 - b6 - 6 - 7',
        category: 'Exotic'
    }
};

// Note names
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Guitar strings (standard tuning, from low to high)
// baseNote is the MIDI note number of the open string
const GUITAR_STRINGS = [
    { name: 'E', octave: 2, baseNote: 40 },  // Low E = E2 = MIDI 40
    { name: 'A', octave: 2, baseNote: 45 },  // A = A2 = MIDI 45
    { name: 'D', octave: 3, baseNote: 50 },  // D = D3 = MIDI 50
    { name: 'G', octave: 3, baseNote: 55 },  // G = G3 = MIDI 55
    { name: 'B', octave: 3, baseNote: 59 },  // B = B3 = MIDI 59
    { name: 'e', octave: 4, baseNote: 64 }   // High e = E4 = MIDI 64
];

// Number of frets to display
const NUM_FRETS = 24;

// Interval colors
const INTERVAL_COLORS = {
    0: '#E53935',   // Root - Red
    1: '#5C6BC0',   // b2 - Indigo
    2: '#1E88E5',   // 2nd - Blue
    3: '#FB8C00',   // b3 - Orange
    4: '#FFB300',   // 3rd - Amber
    5: '#43A047',   // 4th - Green
    6: '#00ACC1',   // #4/b5 - Cyan
    7: '#8E24AA',   // 5th - Purple
    8: '#EC407A',   // b6 - Pink
    9: '#26A69A',   // 6th - Teal
    10: '#D81B60',  // b7 - Magenta
    11: '#FDD835'   // 7th - Yellow
};

// Interval names
const INTERVAL_NAMES = {
    0: 'R',
    1: 'b2',
    2: '2',
    3: 'b3',
    4: '3',
    5: '4',
    6: '#4',
    7: '5',
    8: 'b6',
    9: '6',
    10: 'b7',
    11: '7'
};

// Scale Patterns - Box positions for guitar
// User-provided patterns

// C Major Pattern 1 (user-provided correct frets)
const MAJOR_PATTERN_1 = {
    name: 'Pattern 1',
    // Exact fret positions per string (string 0 is Low E)
    exactFrets: {
        5: [7, 8],              // High e
        4: [8, 10],             // B
        3: [7, 9, 10],          // G
        2: [7, 9, 10],          // D
        1: [7, 8, 10],          // A
        0: [8, 10]              // Low E (root starts at fret 8)
    }
};

// C Major Pattern 2 (3NPS - 3 notes per string)
const MAJOR_PATTERN_2 = {
    name: 'Pattern 2 (3NPS)',
    // Exact fret positions per string (string 0 is Low E)
    exactFrets: {
        5: [10, 12, 13],        // High e
        4: [10, 12, 13],        // B
        3: [9, 10, 12],         // G
        2: [9, 10, 12],         // D
        1: [8, 10, 12],         // A
        0: [8, 10, 12]          // Low E
    }
};

// C Minor Pattern 1
const MINOR_PATTERN_1 = {
    name: 'Minor Pattern 1',
    // Exact fret positions per string (string 0 is Low E)
    exactFrets: {
        5: [8, 10, 11],         // High e
        4: [8, 9, 11],          // B
        3: [7, 8, 10],          // G
        2: [8, 10],              // D
        1: [8, 10, 11],         // A
        0: [8, 10, 11]          // Low E
    }
};

// C Minor Pattern 2 (3NPS)
const MINOR_PATTERN_2 = {
    name: 'Minor Pattern 2 (3NPS)',
    // Exact fret positions per string (string 0 is Low E)
    exactFrets: {
        5: [10, 11, 13],        // High e
        4: [9, 11, 13],         // B
        3: [8, 10, 12],         // G
        2: [8, 10, 12],         // D
        1: [8, 10, 11],         // A
        0: [8, 10, 11]          // Low E
    }
};

// C Phrygian Pattern 1
const PHRYGIAN_PATTERN_1 = {
    name: 'Phrygian Pattern 1',
    // Exact fret positions per string (string 0 is Low E)
    exactFrets: {
        5: [8, 9, 11],         // High e
        4: [8, 9, 11],         // B
        3: [8, 10],             // G
        2: [8, 10, 11],         // D
        1: [8, 10, 11],         // A
        0: [8, 9, 11]           // Low E
    }
};

// Separate pattern sets for each scale type
const MAJOR_PATTERNS = {
    majorPattern1: MAJOR_PATTERN_1,
    majorPattern2: MAJOR_PATTERN_2
};

const MINOR_PATTERNS = {
    minorPattern1: MINOR_PATTERN_1,
    minorPattern2: MINOR_PATTERN_2
};

const PHRYGIAN_PATTERNS = {
    phrygianPattern1: PHRYGIAN_PATTERN_1
};

// Mode positions (for modes like Dorian, Phrygian, etc.)
const MODE_POSITIONS = {
    majorPattern1: MAJOR_PATTERN_1,
    majorPattern2: MAJOR_PATTERN_2,
    minorPattern1: MINOR_PATTERN_1,
    phrygianPattern1: PHRYGIAN_PATTERN_1
};

// Pentatonic patterns - TO BE PROVIDED
const PENTATONIC_PATTERNS = {
    // User will provide these
};

// Check if a scale is pentatonic (5 notes)
function isPentatonicScale(scaleKey) {
    return ['majorPenta', 'minorPenta'].includes(scaleKey);
}

// Check if a scale has 7 notes (modes)
function isSevenNoteScale(scaleKey) {
    const scale = SCALES[scaleKey];
    return scale && scale.intervals.length === 7;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SCALES, NOTES, GUITAR_STRINGS, NUM_FRETS, INTERVAL_COLORS, INTERVAL_NAMES };
}
