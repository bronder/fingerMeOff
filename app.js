// Guitar Scale App - Core Logic

class GuitarScaleApp {
    constructor() {
        // Load saved preferences or use defaults
        this.currentKey = localStorage.getItem('guitarApp_key') || 'C';
        this.currentScale = localStorage.getItem('guitarApp_scale') || 'major';
        this.currentPattern = localStorage.getItem('guitarApp_pattern') || 'all';
        this.currentTempo = localStorage.getItem('guitarApp_tempo') || 'medium';
        this.showIntervals = localStorage.getItem('guitarApp_intervals') !== 'false';
        this.octaveRange = localStorage.getItem('guitarApp_octave') || '0-12';
        
        this.init();
    }
    
    savePreferences() {
        localStorage.setItem('guitarApp_key', this.currentKey);
        localStorage.setItem('guitarApp_scale', this.currentScale);
        localStorage.setItem('guitarApp_pattern', this.currentPattern);
        localStorage.setItem('guitarApp_tempo', this.currentTempo);
        localStorage.setItem('guitarApp_intervals', this.showIntervals);
        localStorage.setItem('guitarApp_octave', this.octaveRange);
    }

    init() {
        this.populateDropdowns();
        this.bindEvents();
        
        // Set initial dropdown values from saved preferences
        document.getElementById('keySelect').value = this.currentKey;
        document.getElementById('scaleSelect').value = this.currentScale;
        document.getElementById('octaveSelect').value = this.octaveRange;
        
        // Set tempo button
        document.querySelectorAll('.tempo-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tempo === this.currentTempo);
        });
        
        this.renderGuitarNeck();
        this.updateScaleInfo();
    }

    // Populate the dropdown menus
    populateDropdowns() {
        const keySelect = document.getElementById('keySelect');
        const scaleSelect = document.getElementById('scaleSelect');

        // Populate keys
        NOTES.forEach(note => {
            const option = document.createElement('option');
            option.value = note;
            option.textContent = note;
            keySelect.appendChild(option);
        });

        // Populate scales by category
        const categories = {};
        Object.entries(SCALES).forEach(([key, scale]) => {
            if (!categories[scale.category]) {
                categories[scale.category] = [];
            }
            categories[scale.category].push({ key, ...scale });
        });

        Object.entries(categories).forEach(([category, scales]) => {
            // Add category header
            const group = document.createElement('optgroup');
            group.label = category;
            
            scales.forEach(scale => {
                const option = document.createElement('option');
                option.value = scale.key;
                option.textContent = scale.name;
                group.appendChild(option);
            });
            
            scaleSelect.appendChild(group);
        });

        // Initialize pattern dropdown
        this.updatePatternDropdown();
    }

    // Update pattern dropdown based on selected scale
    updatePatternDropdown() {
        const patternSelect = document.getElementById('patternSelect');
        patternSelect.innerHTML = '';

        // Always add "Show All" option
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'Show All Notes';
        patternSelect.appendChild(allOption);

        // Add scale-specific patterns
        if (isPentatonicScale(this.currentScale)) {
            // Add pentatonic boxes
            const pentaGroup = document.createElement('optgroup');
            pentaGroup.label = 'Pentatonic Boxes';
            
            Object.entries(PENTATONIC_PATTERNS).forEach(([key, pattern]) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = pattern.name;
                pentaGroup.appendChild(option);
            });
            patternSelect.appendChild(pentaGroup);
        } else if (['major', 'ionian'].includes(this.currentScale)) {
            // Add major patterns only
            const scaleGroup = document.createElement('optgroup');
            scaleGroup.label = 'Major Patterns';
            
            Object.entries(MAJOR_PATTERNS).forEach(([key, pattern]) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = pattern.name;
                scaleGroup.appendChild(option);
            });
            patternSelect.appendChild(scaleGroup);
        } else if (['minor', 'aeolian'].includes(this.currentScale)) {
            // Add minor patterns only
            const scaleGroup = document.createElement('optgroup');
            scaleGroup.label = 'Minor Patterns';
            
            Object.entries(MINOR_PATTERNS).forEach(([key, pattern]) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = pattern.name;
                scaleGroup.appendChild(option);
            });
            patternSelect.appendChild(scaleGroup);
        } else if (['phrygian'].includes(this.currentScale)) {
            // Add phrygian patterns only
            const scaleGroup = document.createElement('optgroup');
            scaleGroup.label = 'Phrygian Patterns';
            
            Object.entries(PHRYGIAN_PATTERNS).forEach(([key, pattern]) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = pattern.name;
                scaleGroup.appendChild(option);
            });
            patternSelect.appendChild(scaleGroup);
        }

        // Reset to "all" if current pattern doesn't exist for this scale
        if (this.currentPattern !== 'all') {
            const exists = Array.from(patternSelect.options).some(opt => opt.value === this.currentPattern);
            if (!exists) {
                this.currentPattern = 'all';
            }
        }
        
        patternSelect.value = this.currentPattern;
    }

    // Bind event listeners
    bindEvents() {
        // Key selection
        document.getElementById('keySelect').addEventListener('change', (e) => {
            this.currentKey = e.target.value;
            this.savePreferences();
            this.renderGuitarNeck();
            this.updateScaleInfo();
            this.forceRefresh();
        });

        // Scale selection
        document.getElementById('scaleSelect').addEventListener('change', (e) => {
            this.currentScale = e.target.value;
            this.currentPattern = 'all';
            this.savePreferences();
            this.updatePatternDropdown();
            this.renderGuitarNeck();
            this.updateScaleInfo();
            this.forceRefresh();
        });

        // Pattern selection
        document.getElementById('patternSelect').addEventListener('change', (e) => {
            this.currentPattern = e.target.value;
            this.savePreferences();
            this.renderGuitarNeck();
            this.forceRefresh();
        });

        // Octave range selection
        document.getElementById('octaveSelect').addEventListener('change', (e) => {
            this.octaveRange = e.target.value;
            this.savePreferences();
            this.renderGuitarNeck();
            this.forceRefresh();
        });

        // Play button
        document.getElementById('playBtn').addEventListener('click', () => {
            this.togglePlayback();
        });

        // Tempo buttons
        document.querySelectorAll('.tempo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tempo-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentTempo = e.target.dataset.tempo;
                this.savePreferences();
            });
        });
    }

    // Force DOM refresh
    forceRefresh() {
        const neck = document.getElementById('guitarNeck');
        neck.style.display = 'none';
        requestAnimationFrame(() => {
            neck.style.display = 'block';
        });
    }

    // Calculate all notes in a scale for a given key
    getScaleNotes(key, scaleKey) {
        const scale = SCALES[scaleKey];
        if (!scale) return [];

        const keyIndex = NOTES.indexOf(key);
        const scaleNotes = [];

        scale.intervals.forEach(interval => {
            const noteIndex = (keyIndex + interval) % 12;
            // Use octave 4 as base (MIDI 48-59 range), shift up an octave if needed
            const octave = keyIndex + interval >= 12 ? 5 : 4;
            scaleNotes.push({
                note: NOTES[noteIndex],
                interval: interval,
                midi: 12 * octave + noteIndex
            });
        });

        return scaleNotes;
    }

    // Get pattern definition for current scale and pattern
    getPatternDefinition() {
        if (this.currentPattern === 'all') return null;
        
        if (isPentatonicScale(this.currentScale)) {
            return PENTATONIC_PATTERNS[this.currentPattern];
        } else if (['major', 'ionian'].includes(this.currentScale)) {
            return MAJOR_PATTERNS[this.currentPattern] || null;
        } else if (['minor', 'aeolian'].includes(this.currentScale)) {
            return MINOR_PATTERNS[this.currentPattern] || null;
        } else if (['phrygian'].includes(this.currentScale)) {
            return PHRYGIAN_PATTERNS[this.currentPattern] || null;
        }
        return null;
    }

    // Get positions filtered by pattern - ONLY within the box
    getPatternPositions(scaleNotes, pattern, key) {
        if (!pattern || !pattern.exactFrets) {
            return this.getAllPositions(scaleNotes);
        }

        const keyIndex = NOTES.indexOf(key);
        
        // Find the lowest root position on Low E (string 0) for this key
        const lowEString = GUITAR_STRINGS[0];
        let lowestRootFret = 0;
        for (let f = 0; f <= 12; f++) {
            const noteAtF = (lowEString.baseNote + f) % 12;
            if (noteAtF === keyIndex) {
                lowestRootFret = f;
                break;
            }
        }
        
        // Calculate fret shift from C Major pattern position to target key
        const cMajorRootFret = pattern.exactFrets[0] ? pattern.exactFrets[0][0] : 0;
        const fretShift = lowestRootFret - cMajorRootFret;

        const positions = [];
        
        // For each string in the pattern, apply the shift
        GUITAR_STRINGS.forEach((string, stringIndex) => {
            const patternFrets = pattern.exactFrets[stringIndex];
            if (!patternFrets) return;
            
            // For each fret in the pattern, calculate its shifted position
            patternFrets.forEach(fret => {
                const shiftedFret = fret + fretShift;
                if (shiftedFret > NUM_FRETS) return;
                if (shiftedFret < 0) return;
                
                // Calculate what note is at this shifted fret in standard tuning
                const actualNote = (string.baseNote + shiftedFret) % 12;
                
                // This note's interval from the pattern's reference root (C)
                const patternInterval = (string.baseNote + fret) % 12;
                
                // Apply this interval to the new key to get expected note
                const targetNote = (keyIndex + patternInterval) % 12;
                
                // Only include if the actual note matches the target note for this key
                if (actualNote === targetNote) {
                    // Use actual MIDI value based on string's open string tuning
                    const midi = string.baseNote + shiftedFret;
                    positions.push({
                        string: stringIndex,
                        fret: shiftedFret,
                        note: NOTES[actualNote],
                        interval: patternInterval,
                        midi: midi
                    });
                }
            });
        });

        return positions;
    }

    // Get all positions on the fretboard
    getAllPositions(scaleNotes) {
        const positions = [];
        const scaleIntervals = new Set(scaleNotes.map(n => n.interval));

        GUITAR_STRINGS.forEach((string, stringIndex) => {
            for (let fret = 0; fret <= NUM_FRETS; fret++) {
                const midi = string.baseNote + fret;
                const noteIndex = midi % 12;
                
                if (scaleIntervals.has(noteIndex)) {
                    positions.push({
                        string: stringIndex,
                        fret: fret,
                        note: NOTES[noteIndex],
                        interval: noteIndex,
                        midi: midi
                    });
                }
            }
        });

        return positions;
    }

    // Render the guitar neck
    renderGuitarNeck() {
        const neck = document.getElementById('guitarNeck');
        const scaleNotes = this.getScaleNotes(this.currentKey, this.currentScale);
        const pattern = this.getPatternDefinition();
        let positions = this.getPatternPositions(scaleNotes, pattern, this.currentKey);
        
        // If 12-24 octave range, shift positions UP by 12
        if (this.octaveRange === '12-24') {
            positions = positions.map(p => ({
                ...p,
                fret: p.fret + 12
            }));
        }
        
        // Clear existing content completely
        while (neck.firstChild) {
            neck.removeChild(neck.firstChild);
        }
        neck.innerHTML = '';

        // Add fret numbers header row
        const headerRow = document.createElement('div');
        headerRow.className = 'fretboard-header';
        
        const stringLabel = document.createElement('div');
        stringLabel.className = 'string-label';
        headerRow.appendChild(stringLabel);
        
        for (let fret = 0; fret <= NUM_FRETS; fret++) {
            const num = document.createElement('div');
            num.className = 'fret-number';
            num.textContent = fret === 0 ? 'nut' : fret;
            headerRow.appendChild(num);
        }
        neck.appendChild(headerRow);

        // Add nut bar (only if NOT in 12-24 mode)
        if (this.octaveRange !== '12-24') {
            const nut = document.createElement('div');
            nut.className = 'fretboard-nut';
            const nutSpacer = document.createElement('div');
            nutSpacer.className = 'string-label';
            nut.appendChild(nutSpacer);
            const nutBar = document.createElement('div');
            nutBar.className = 'nut-bar';
            nut.appendChild(nutBar);
            neck.appendChild(nut);
        }

        // Render each string row (reversed order - high e at top, low E at bottom)
        const reversedStrings = [...GUITAR_STRINGS].reverse();
        reversedStrings.forEach((string, displayIndex) => {
            const originalStringIndex = GUITAR_STRINGS.length - 1 - displayIndex;
            
            const stringRow = document.createElement('div');
            stringRow.className = 'fretboard-string';

            // String name
            const stringName = document.createElement('div');
            stringName.className = 'string-name';
            stringName.textContent = string.name;
            stringRow.appendChild(stringName);

            // Create frets for this string
            for (let fret = 0; fret <= NUM_FRETS; fret++) {
                const fretCell = document.createElement('div');
                fretCell.className = 'fret-cell';
                
                // Check if there's a note at this position
                const notePos = positions.find(p => p.string === originalStringIndex && p.fret === fret);
                
                if (notePos) {
                    const noteDot = this.createNoteDot(notePos, scaleNotes);
                    fretCell.appendChild(noteDot);
                }

                // Add inlay markers under D and G strings (indices 2 and 3)
                if ((originalStringIndex === 2 || originalStringIndex === 3)) {
                    if ([3, 5, 7, 9, 15, 17, 19, 21].includes(fret)) {
                        const marker = document.createElement('div');
                        marker.className = 'inlay-marker';
                        fretCell.appendChild(marker);
                    } else if (fret === 12 || fret === 24) {
                        const marker = document.createElement('div');
                        marker.className = 'inlay-marker double';
                        marker.innerHTML = '<span></span><span></span>';
                        fretCell.appendChild(marker);
                    }
                }

                stringRow.appendChild(fretCell);
            }

            neck.appendChild(stringRow);
        });

        // Add fret numbers footer row
        const footerRow = document.createElement('div');
        footerRow.className = 'fretboard-footer';
        
        const footerSpacer = document.createElement('div');
        footerSpacer.className = 'string-label';
        footerRow.appendChild(footerSpacer);
        
        for (let fret = 0; fret <= NUM_FRETS; fret++) {
            const num = document.createElement('div');
            num.className = 'fret-number';
            num.textContent = fret === 0 ? '' : fret;
            footerRow.appendChild(num);
        }
        neck.appendChild(footerRow);
    }

    // Create a note dot element
    createNoteDot(notePos, scaleNotes) {
        const dot = document.createElement('div');
        dot.className = 'note-dot';
        dot.style.backgroundColor = INTERVAL_COLORS[notePos.interval];
        
        // Add note name
        const noteName = document.createElement('span');
        noteName.className = 'note-name';
        noteName.textContent = notePos.note;
        dot.appendChild(noteName);

        // Add interval name
        const intervalName = document.createElement('span');
        intervalName.className = 'interval-name';
        intervalName.textContent = INTERVAL_NAMES[notePos.interval];
        dot.appendChild(intervalName);

        // Play note on click
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            const frequency = 440 * Math.pow(2, (notePos.midi - 69) / 12);
            audioEngine.playNoteClick(frequency);
        });

        return dot;
    }

    // Generate guitar tab from positions
    generateGuitarTab(positions) {
        // String names (high e at top to low E at bottom)
        const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
        
        // Find max fret for line width
        const maxFret = positions.length > 0 ? Math.max(...positions.map(p => p.fret)) : 12;
        const lineWidth = Math.max(maxFret + 5, 40);
        
        // Create a map of string -> sorted array of fret numbers
        const stringFrets = {};
        positions.forEach(p => {
            if (!stringFrets[p.string]) stringFrets[p.string] = [];
            stringFrets[p.string].push(p.fret);
        });
        
        // Sort each string's frets
        Object.keys(stringFrets).forEach(string => {
            stringFrets[string].sort((a, b) => a - b);
        });
        
        // Build tab lines
        const lines = [];
        
        for (let string = 5; string >= 0; string--) {
            const frets = stringFrets[string] || [];
            
            if (frets.length > 0) {
                // Build a character array for the line
                let line = new Array(lineWidth).fill('-');
                line[0] = stringNames[5 - string];
                line[1] = '|';
                
                frets.forEach((fret, i) => {
                    const pos = 2 + fret;
                    if (pos < lineWidth) {
                        line[pos] = fret.toString();
                        // Add dash between consecutive frets if needed
                        if (i > 0 && fret === frets[i-1] + 1) {
                            // consecutive frets - single dash between
                            line[pos - 1] = '-';
                        }
                    }
                });
                
                lines.push(line.join(''));
            } else {
                lines.push(stringNames[5 - string] + '|' + '-'.repeat(lineWidth - 2));
            }
        }
        
        return lines.join('\n');
    }

    // Update the scale information panel
    updateScaleInfo() {
        const scale = SCALES[this.currentScale];
        const scaleNotes = this.getScaleNotes(this.currentKey, this.currentScale);
        const pattern = this.getPatternDefinition();
        const positions = this.getPatternPositions(scaleNotes, pattern, this.currentKey);

        // Update scale name
        document.getElementById('scaleName').textContent = `${this.currentKey} ${scale.name}`;
        
        // Update formula
        document.getElementById('scaleFormula').textContent = scale.formula;

        // Update guitar tab
        const tabDisplay = document.getElementById('guitarTab');
        if (tabDisplay) {
            tabDisplay.textContent = this.generateGuitarTab(positions);
        }

        // Update notes display
        const notesContainer = document.getElementById('scaleNotesDisplay');
        notesContainer.innerHTML = '';
        scaleNotes.forEach(note => {
            const noteEl = document.createElement('div');
            noteEl.className = 'scale-note';
            noteEl.style.backgroundColor = INTERVAL_COLORS[note.interval];
            noteEl.textContent = `${note.note}`;
            if (note.interval === 0) {
                noteEl.classList.add('root');
            }
            notesContainer.appendChild(noteEl);
        });

        // Update intervals list
        const intervalsContainer = document.getElementById('intervalsList');
        intervalsContainer.innerHTML = '';
        scaleNotes.forEach(note => {
            const li = document.createElement('li');
            li.style.color = INTERVAL_COLORS[note.interval];
            li.textContent = `${INTERVAL_NAMES[note.interval]}`;
            intervalsContainer.appendChild(li);
        });

        // Update interval legend
        this.updateIntervalLegend();
    }

    // Update the interval legend
    updateIntervalLegend() {
        const legend = document.getElementById('intervalLegend');
        legend.innerHTML = '';

        Object.entries(INTERVAL_NAMES).forEach(([interval, name]) => {
            const item = document.createElement('div');
            item.className = 'legend-item';
            
            const dot = document.createElement('div');
            dot.className = 'legend-dot';
            dot.style.backgroundColor = INTERVAL_COLORS[interval];
            
            const text = document.createElement('span');
            text.textContent = name;
            
            item.appendChild(dot);
            item.appendChild(text);
            legend.appendChild(item);
        });
    }

    // Toggle playback
    async togglePlayback() {
        const playBtn = document.getElementById('playBtn');
        
        if (audioEngine.isPlaying) {
            audioEngine.stop();
            playBtn.classList.remove('playing');
            playBtn.innerHTML = '▶ Play Scale';
        } else {
            const scaleNotes = this.getScaleNotes(this.currentKey, this.currentScale);
            const pattern = this.getPatternDefinition();
            const positions = this.getPatternPositions(scaleNotes, pattern, this.currentKey);
            
            // Sort by fret position for sequential playback
            positions.sort((a, b) => {
                if (a.fret !== b.fret) return a.fret - b.fret;
                return a.string - b.string;
            });

            playBtn.classList.add('playing');
            playBtn.innerHTML = '■ Stop';
            
            await audioEngine.playScale(positions, this.currentTempo);
            
            playBtn.classList.remove('playing');
            playBtn.innerHTML = '▶ Play Scale';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new GuitarScaleApp();
});
