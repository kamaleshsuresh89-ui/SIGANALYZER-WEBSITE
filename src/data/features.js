/**
 * SIGANALYZER Features Registry
 * Every capability is rigorously tagged with its current development status:
 * - 'Core Engine': Built into the fundamental DSP processing core
 * - 'Implemented': Fully operational in technical preview
 * - 'Planned': On roadmap for subsequent milestone phases
 */

export const FEATURE_STATUS = {
  CORE: { label: 'Core Engine', class: 'badge-cyan' },
  IMPLEMENTED: { label: 'Implemented', class: 'badge-emerald' },
  PLANNED: { label: 'Planned', class: 'badge-outline' }
};

export const FEATURE_CATEGORIES = [
  {
    id: 'ingestion',
    title: 'Signal Ingestion & Preprocessing',
    description: 'Automated container identification, validation, and conditioning for complex RF files.',
    features: [
      {
        name: 'Automatic IQ & WAV Detection',
        status: FEATURE_STATUS.IMPLEMENTED,
        description: 'Instant parsing of file headers and raw binary arrays to detect IQ interleaving (I/Q pairs) vs standard audio WAV.'
      },
      {
        name: 'Header & Metadata Extraction',
        status: FEATURE_STATUS.IMPLEMENTED,
        description: 'Direct extraction of sampling rate, bit depth, channel configuration, endianness, and capture duration.'
      },
      {
        name: 'Signal Integrity Validation',
        status: FEATURE_STATUS.IMPLEMENTED,
        description: 'Sanity checks for buffer overflows, clipping, NaN/Inf floating values, and dropped sample discontinuities.'
      },
      {
        name: 'Adaptive DSP Preconditioning',
        status: FEATURE_STATUS.CORE,
        description: 'DC offset cancellation, automatic gain calibration, and windowed bandpass pre-filtering.'
      }
    ]
  },
  {
    id: 'spectral',
    title: 'Time & Frequency Domain DSP',
    description: 'High-resolution transforms and statistical measurements across signal dimensions.',
    features: [
      {
        name: 'High-Resolution FFT & PSD',
        status: FEATURE_STATUS.IMPLEMENTED,
        description: 'Configurable windowing (Blackman-Harris, Hann, Flat-top) with power spectral density estimation.'
      },
      {
        name: 'Spectrogram & Waterfall Cascade',
        status: FEATURE_STATUS.IMPLEMENTED,
        description: 'Real-time 2D time-frequency heatmaps displaying burst duration, frequency hopping, and transient activity.'
      },
      {
        name: 'Automated Burst & Carrier Detection',
        status: FEATURE_STATUS.CORE,
        description: 'Energy detector algorithms and cyclic autocorrelation to isolate transmission intervals from background noise.'
      },
      {
        name: 'Bandwidth & Noise Floor Measurement',
        status: FEATURE_STATUS.IMPLEMENTED,
        description: 'Rigorous calculation of 99% Occupied Bandwidth (OBW), -3dB / -20dB bandwidths, and median noise floor.'
      }
    ]
  },
  {
    id: 'modulation',
    title: 'Modulation & Synchronization',
    description: 'Deep classification of analog and digital modulation schemes with constellation geometry.',
    features: [
      {
        name: 'Modulation Classification',
        status: FEATURE_STATUS.IMPLEMENTED,
        description: 'Automatic classification of FSK, PSK, QAM, ASK, and CW using higher-order cumulants and decision trees.'
      },
      {
        name: 'Constellation & Phase Plane Analysis',
        status: FEATURE_STATUS.IMPLEMENTED,
        description: 'In-phase versus Quadrature trajectory mapping, cluster centroid calculation, and phase jitter metrics.'
      },
      {
        name: 'Symbol Timing & Carrier Sync',
        status: FEATURE_STATUS.CORE,
        description: 'Gardner symbol timing recovery and Costas loop carrier frequency offset (CFO) tracking.'
      },
      {
        name: 'Demodulation Pipeline',
        status: FEATURE_STATUS.IMPLEMENTED,
        description: 'Symbol slicing and hard/soft bit mapping for classified modulation formats (BPSK, QPSK, 2-FSK, 4-FSK).'
      }
    ]
  },
  {
    id: 'protocol',
    title: 'Bitstream Forensics & Protocol Discovery',
    description: 'Transforming demodulated digital symbols into structured packet frames and protocol insights.',
    features: [
      {
        name: 'Bitstream Forensics & Symbol Slicing',
        status: FEATURE_STATUS.IMPLEMENTED,
        description: 'Statistical entropy analysis, run-length validation, and transition density inspection.'
      },
      {
        name: 'Frame Boundary & Sync Word Discovery',
        status: FEATURE_STATUS.CORE,
        description: 'Correlation against known preambles (Barker codes, sync words) and automated periodic delimiter search.'
      },
      {
        name: 'FEC & De-interleaving Engine',
        status: FEATURE_STATUS.PLANNED,
        description: 'Convolutional code decoding, Reed-Solomon verification, and block de-interleaving architecture.'
      },
      {
        name: 'Protocol Structure Profiling',
        status: FEATURE_STATUS.PLANNED,
        description: 'Heuristic payload field isolation, CRC polynomial verification, and frame length inference.'
      }
    ]
  },
  {
    id: 'architecture',
    title: 'Quality, Forensics & Offline Security',
    description: 'Device-native execution model protecting proprietary and sensitive RF captures.',
    features: [
      {
        name: '100% Offline-First Execution',
        status: FEATURE_STATUS.IMPLEMENTED,
        description: 'All DSP math executes locally on your CPU/GPU. No cloud dependencies, no external telemetry.'
      },
      {
        name: 'RF Quality & Impairment Metrics',
        status: FEATURE_STATUS.IMPLEMENTED,
        description: 'Quantitative measurement of SNR, EVM (Error Vector Magnitude), MER, IQ imbalance, and carrier leakage.'
      },
      {
        name: 'Scientific Explainability Inspector',
        status: FEATURE_STATUS.IMPLEMENTED,
        description: 'Every classification pairs results with confidence scores, mathematical methods, and verified evidence.'
      },
      {
        name: 'Automated Comprehensive Reporting',
        status: FEATURE_STATUS.IMPLEMENTED,
        description: 'Export complete multi-page forensic reports (PDF/HTML/JSON) containing spectral plots and parameters.'
      }
    ]
  }
];
