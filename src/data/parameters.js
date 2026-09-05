/**
 * SIGANALYZER Parameter Extraction Catalog
 * Comprehensive 6-category dictionary of RF and protocol parameters.
 * 
 * Scientific Certainty Levels:
 * - DIRECT: Directly extracted from container headers or file metadata
 * - MEASURED: Computed deterministically through mathematical transforms
 * - ESTIMATED: Statistical approximation with bounds
 * - INFERRED: Algorithmic / classifier determination
 * - PROBABLE: Heuristic pattern match with confidence scoring
 * - UNKNOWN: Indeterminate due to noise or insufficient samples
 */

export const CERTAINTY_LEVELS = {
  DIRECT: { id: 'direct', label: 'DIRECT', class: 'status-direct', desc: 'Direct header / metadata read' },
  MEASURED: { id: 'measured', label: 'MEASURED', class: 'status-measured', desc: 'Deterministic DSP computation' },
  ESTIMATED: { id: 'estimated', label: 'ESTIMATED', class: 'status-estimated', desc: 'Statistical optimization estimation' },
  INFERRED: { id: 'inferred', label: 'INFERRED', class: 'status-inferred', desc: 'Feature classification inference' },
  PROBABLE: { id: 'probable', label: 'PROBABLE', class: 'status-probable', desc: 'Heuristic correlation match' },
  UNKNOWN: { id: 'unknown', label: 'UNKNOWN', class: 'status-unknown', desc: 'Indeterminate under low SNR' }
};

export const PARAMETER_CATEGORIES = [
  {
    id: 'file-capture',
    name: 'File & Capture',
    description: 'Hardware capture parameters and container serialization properties.',
    parameters: [
      { name: 'File Format', type: 'Container', example: '.iq (Complex Float32) / .wav (PCM)', certainty: CERTAINTY_LEVELS.DIRECT },
      { name: 'Sample Rate', type: 'Rate', example: '20.00 MSps (20,000,000 Hz)', certainty: CERTAINTY_LEVELS.DIRECT },
      { name: 'Capture Duration', type: 'Time', example: '2.458 Seconds', certainty: CERTAINTY_LEVELS.DIRECT },
      { name: 'Total Samples', type: 'Count', example: '49,160,000 Samples', certainty: CERTAINTY_LEVELS.DIRECT },
      { name: 'Bit Depth', type: 'Resolution', example: '16-bit / 32-bit float', certainty: CERTAINTY_LEVELS.DIRECT },
      { name: 'Channel Count', type: 'Geometry', example: '2 Channels (I & Q quadrature)', certainty: CERTAINTY_LEVELS.DIRECT },
      { name: 'Byte Endianness', type: 'Architecture', example: 'Little-Endian (LE)', certainty: CERTAINTY_LEVELS.DIRECT },
      { name: 'File Size on Disk', type: 'Storage', example: '393.28 MB', certainty: CERTAINTY_LEVELS.DIRECT }
    ]
  },
  {
    id: 'time-domain',
    name: 'Time Domain',
    description: 'Statistical power, envelope dynamics, and amplitude distribution.',
    parameters: [
      { name: 'RMS Amplitude', type: 'Power', example: '0.2415 Vrms (-12.34 dBFS)', certainty: CERTAINTY_LEVELS.MEASURED },
      { name: 'Peak Amplitude', type: 'Voltage', example: '0.8920 Vpeak (-0.99 dBFS)', certainty: CERTAINTY_LEVELS.MEASURED },
      { name: 'Crest Factor', type: 'Ratio', example: '3.693 (11.35 dB)', certainty: CERTAINTY_LEVELS.MEASURED },
      { name: 'PAPR (Peak-to-Average)', type: 'Power Ratio', example: '7.82 dB', certainty: CERTAINTY_LEVELS.MEASURED },
      { name: 'Mean (DC Bias)', type: 'Offset', example: '+0.0012 V', certainty: CERTAINTY_LEVELS.MEASURED },
      { name: 'Variance / Std Dev', type: 'Distribution', example: 'σ² = 0.0583, σ = 0.2415', certainty: CERTAINTY_LEVELS.MEASURED },
      { name: 'Dynamic Range', type: 'Span', example: '74.2 dB', certainty: CERTAINTY_LEVELS.MEASURED }
    ]
  },
  {
    id: 'frequency-domain',
    name: 'Frequency Domain',
    description: 'Spectral distribution, bandwidth occupancies, and carrier metrics.',
    parameters: [
      { name: 'Peak Frequency', type: 'Carrier', example: '433.920 MHz (baseband offset +12.4 kHz)', certainty: CERTAINTY_LEVELS.MEASURED },
      { name: 'Occupied Bandwidth (99%)', type: 'Bandwidth', example: '156.40 kHz', certainty: CERTAINTY_LEVELS.MEASURED },
      { name: '-3dB Bandwidth', type: 'Cutoff', example: '124.80 kHz', certainty: CERTAINTY_LEVELS.MEASURED },
      { name: 'Noise Floor', type: 'PSD Level', example: '-94.20 dBFS / Hz', certainty: CERTAINTY_LEVELS.ESTIMATED },
      { name: 'Carrier Frequency Offset (CFO)', type: 'Drift', example: '+1,420.3 Hz', certainty: CERTAINTY_LEVELS.ESTIMATED },
      { name: 'Spectral Rolloff', type: 'Shape', example: 'α = 0.35 (Root-Raised-Cosine)', certainty: CERTAINTY_LEVELS.INFERRED }
    ]
  },
  {
    id: 'modulation',
    name: 'Modulation',
    description: 'Symbol geometry, modulation family, and constellation timing metrics.',
    parameters: [
      { name: 'Modulation Family', type: 'Classification', example: 'QPSK (Quadrature Phase Shift Keying)', certainty: CERTAINTY_LEVELS.INFERRED },
      { name: 'Modulation Order (M)', type: 'Alphabet Size', example: 'M = 4 (2 bits / symbol)', certainty: CERTAINTY_LEVELS.INFERRED },
      { name: 'Symbol Rate', type: 'Baud', example: '100.00 kBaud', certainty: CERTAINTY_LEVELS.ESTIMATED },
      { name: 'Samples Per Symbol (SPS)', type: 'Oversampling', example: '200.00 SPS', certainty: CERTAINTY_LEVELS.MEASURED },
      { name: 'Constellation Centroids', type: 'Coordinates', example: '4 distinct symmetrical clusters', certainty: CERTAINTY_LEVELS.MEASURED },
      { name: 'Frequency Deviation (Δf)', type: 'Deviation', example: 'N/A (Phase-Modulated)', certainty: CERTAINTY_LEVELS.UNKNOWN }
    ]
  },
  {
    id: 'signal-quality',
    name: 'Signal Quality & Impairments',
    description: 'Forensic evaluation of distortion, phase noise, and channel degradation.',
    parameters: [
      { name: 'SNR (Signal-to-Noise)', type: 'Quality', example: '28.45 dB', certainty: CERTAINTY_LEVELS.ESTIMATED },
      { name: 'SINR (Signal-to-Interference)', type: 'Quality', example: '26.10 dB', certainty: CERTAINTY_LEVELS.ESTIMATED },
      { name: 'EVM (Error Vector Mag)', type: 'Purity', example: '3.12% RMS', certainty: CERTAINTY_LEVELS.MEASURED },
      { name: 'MER (Modulation Error Ratio)', type: 'Purity', example: '30.11 dB', certainty: CERTAINTY_LEVELS.MEASURED },
      { name: 'IQ Amplitude Imbalance', type: 'Impairment', example: '0.04 dB (I/Q Gain Match: 99.5%)', certainty: CERTAINTY_LEVELS.MEASURED },
      { name: 'IQ Phase Quadrature Error', type: 'Impairment', example: '0.28°', certainty: CERTAINTY_LEVELS.MEASURED },
      { name: 'Carrier Leakage / DC Offset', type: 'Spur', example: '-48.2 dBc', certainty: CERTAINTY_LEVELS.MEASURED }
    ]
  },
  {
    id: 'digital-protocol',
    name: 'Digital & Protocol Forensics',
    description: 'Bitstream reconstruction, packet framing, and cyclic redundancy checks.',
    parameters: [
      { name: 'Effective Bit Rate', type: 'Throughput', example: '200.00 kbps (gross)', certainty: CERTAINTY_LEVELS.ESTIMATED },
      { name: 'Bit Transition Density', type: 'Entropy', example: '0.498 (balanced white noise / whitened)', certainty: CERTAINTY_LEVELS.MEASURED },
      { name: 'Detected Preamble', type: 'Sync', example: '0xAA 0xAA 0xAA (24 bits alternating)', certainty: CERTAINTY_LEVELS.PROBABLE },
      { name: 'Sync Word Match', type: 'Delimiter', example: '0xD3 0x91 0xD3 0x91 (32 bits)', certainty: CERTAINTY_LEVELS.PROBABLE },
      { name: 'Packet Frame Length', type: 'Payload Span', example: '64 Bytes per burst', certainty: CERTAINTY_LEVELS.INFERRED },
      { name: 'CRC Validity Indicator', type: 'Integrity', example: 'CRC-16-CCITT: VALID (0x8F4A)', certainty: CERTAINTY_LEVELS.MEASURED }
    ]
  }
];
