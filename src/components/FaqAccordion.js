/**
 * SIGANALYZER FaqAccordion Component
 * Technical FAQ with accessible collapsible details.
 */

export function renderFaqAccordion() {
  const faqs = [
    {
      q: 'What input signal file formats does SIGANALYZER support?',
      a: 'SIGANALYZER supports raw interleaved IQ files (complex float32, int16, and uint8 binary captures) as well as standard audio RIFF/WAV captures (mono and stereo quadrature). It also handles headerless raw binary dumps from common SDR tools like GQRX, SDR#, and GNU Radio.'
    },
    {
      q: 'Does SIGANALYZER upload any signal data or telemetry to the cloud?',
      a: 'No. SIGANALYZER operates with a strict 100% offline-first architecture. All binary file parsing, Fast Fourier Transforms, modulation classifiers, and protocol decoders execute entirely in local device RAM and CPU/GPU cores. No network sockets are opened for signal processing.'
    },
    {
      q: 'Which Software Defined Radios (SDR) produce compatible captures?',
      a: 'Any SDR capable of saving baseband IQ or audio captures can produce compatible files. This includes RTL-SDR (v3/v4), HackRF One, LimeSDR, Ettus USRP (B200/N210), BladeRF, Airspy R2/HF+, and PlutoSDR.'
    },
    {
      q: 'How does the scientific explainability framework work?',
      a: 'Unlike traditional tools that output an unverified label, SIGANALYZER couples every classification with Result, Confidence Percentage, Mathematical Evidence (e.g., constellation symmetry, Gardner timing variance, cumulant values), and the specific DSP Method applied.'
    },
    {
      q: 'How does the version and release management system work?',
      a: 'When new versions are published, previous releases do not disappear. The Download Center maintains permanent archives of all previous releases with checksums, architectures, and release notes to guarantee reproducibility for scientific research and forensic audits.'
    },
    {
      q: 'What is the Smart India Hackathon (SIH) context?',
      a: 'SIGANALYZER was conceived and developed as part of the Smart India Hackathon, addressing the challenge of automating RF signal identification, modulation classification, and protocol reverse-engineering for communications research.'
    }
  ];

  const faqsHtml = faqs.map((faq, idx) => `
    <details class="card p-5 mb-3" style="cursor: pointer; border: 1px solid var(--border-default);">
      <summary style="font-weight: 600; font-size: 1.05rem; list-style: none; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
        <span>${faq.q}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" stroke-width="2.5" style="flex-shrink: 0; transition: transform 0.2s ease;">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </summary>
      <div class="mt-4 pt-3" style="border-top: 1px solid var(--border-subtle); font-size: 0.925rem; color: var(--text-secondary); line-height: 1.6;">
        ${faq.a}
      </div>
    </details>
  `).join('');

  return `
    <section class="section-spacing" id="faq-section">
      <div class="container" style="max-width: 860px;">
        
        <div class="text-center mb-10">
          <span class="section-subtitle">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 class="section-title mb-3">Technical Questions & Answers</h2>
          <p class="section-desc mx-auto" style="margin-left: auto; margin-right: auto;">
            Architecture, hardware compatibility, format support, and offline-first operational principles.
          </p>
        </div>

        <div>
          ${faqsHtml}
        </div>

      </div>
    </section>
  `;
}
