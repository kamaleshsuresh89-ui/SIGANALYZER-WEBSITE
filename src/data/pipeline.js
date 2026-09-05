/**
 * SIGANALYZER 14-Stage Signal Processing Pipeline Data
 * Mathematical flow from raw file ingestion to protocol forensic report.
 */

export const PIPELINE_STAGES = [
  {
    step: 1,
    id: 'input',
    title: 'File Input',
    category: 'Ingest',
    shortDesc: 'Raw IQ / WAV capture loading',
    detail: 'Streams binary signal buffers from local storage into zero-copy memory buffers without network transmission.'
  },
  {
    step: 2,
    id: 'format-detect',
    title: 'Format Detection',
    category: 'Ingest',
    shortDesc: 'Container signature identification',
    detail: 'Distinguishes RIFF/WAV headers from headerless raw interleaved IQ (complex float32, int16, uint8).'
  },
  {
    step: 3,
    id: 'metadata',
    title: 'Metadata Extraction',
    category: 'Ingest',
    shortDesc: 'Sampling rate & bit depth profiling',
    detail: 'Extracts sample rate (Fs), bit depth, capture duration, channel layout, and hardware timestamp indicators.'
  },
  {
    step: 4,
    id: 'validation',
    title: 'Signal Validation',
    category: 'Ingest',
    shortDesc: 'Integrity and discontinuity checks',
    detail: 'Scans for ADC clipping, dropped sample discontinuities, buffer overflows, and corrupted frame pointers.'
  },
  {
    step: 5,
    id: 'preprocessing',
    title: 'Preprocessing',
    category: 'DSP Core',
    shortDesc: 'DC removal & anti-alias windowing',
    detail: 'Applies hardware DC offset cancellation, automatic gain control (AGC), and band-limited FIR filtering.'
  },
  {
    step: 6,
    id: 'time-analysis',
    title: 'Time Analysis',
    category: 'DSP Core',
    shortDesc: 'Temporal energy & envelope dynamics',
    detail: 'Computes continuous envelope, instantaneous power, RMS level, peak voltage, crest factor, and PAPR.'
  },
  {
    step: 7,
    id: 'frequency-analysis',
    title: 'Frequency Analysis',
    category: 'DSP Core',
    shortDesc: 'Welch FFT & Power Spectral Density',
    detail: 'Generates high-resolution PSD, 2D spectrogram waterfall, noise floor baseline, and 99% occupied bandwidth.'
  },
  {
    step: 8,
    id: 'signal-detection',
    title: 'Signal Detection',
    category: 'DSP Core',
    shortDesc: 'Burst isolation & carrier centering',
    detail: 'Applies adaptive CFAR thresholding and cyclic autocorrelation to pinpoint active transmission bursts.'
  },
  {
    step: 9,
    id: 'modulation',
    title: 'Modulation Classification',
    category: 'Modulation',
    shortDesc: 'Higher-order cumulant inference',
    detail: 'Evaluates C20, C21, C40, C42 statistical cumulants to classify FSK, PSK, QAM, ASK, or continuous wave (CW).'
  },
  {
    step: 10,
    id: 'synchronization',
    title: 'Synchronization',
    category: 'Modulation',
    shortDesc: 'Symbol timing & carrier recovery',
    detail: 'Runs Gardner timing error detector and Costas carrier recovery loop to eliminate phase and frequency offset.'
  },
  {
    step: 11,
    id: 'demodulation',
    title: 'Demodulation',
    category: 'Demodulation',
    shortDesc: 'Symbol slicing to binary bits',
    detail: 'Performs maximum-likelihood decision slicing across constellation centroids into structured bit sequences.'
  },
  {
    step: 12,
    id: 'bitstream',
    title: 'Bitstream Forensics',
    category: 'Protocol',
    shortDesc: 'Entropy & transition analysis',
    detail: 'Measures bit transition entropy, run-length distributions, DC balance, and scrambling characteristics.'
  },
  {
    step: 13,
    id: 'frame-analysis',
    title: 'Frame Analysis',
    category: 'Protocol',
    shortDesc: 'Preamble, sync & packet framing',
    detail: 'Locates sync word sequences, infers packet lengths, partitions headers from payload, and tests CRC polynomials.'
  },
  {
    step: 14,
    id: 'report',
    title: 'Technical Report',
    category: 'Output',
    shortDesc: 'Forensic PDF/HTML export',
    detail: 'Compiles all extracted parameters, confidence metrics, spectral plots, and raw decoded bitstreams locally.'
  }
];
