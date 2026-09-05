/**
 * SIGANALYZER AboutPage
 * Context regarding the Smart India Hackathon initiative, problem statement, and technical vision.
 */

export function renderAboutPage() {
  return `
    <main class="container" style="padding-top: calc(var(--nav-height) + 2.5rem); padding-bottom: 5rem; max-width: 900px;">
      
      <div class="text-center mb-10">
        <div class="badge badge-cyan mb-3">SMART INDIA HACKATHON INITIATIVE</div>
        <h1 class="hero-title mb-4" style="font-size: clamp(2rem, 4vw, 3.25rem);">
          About SIGANALYZER
        </h1>
        <p class="section-desc mx-auto" style="margin-left: auto; margin-right: auto; font-size: 1.1rem;">
          Bridging the gap between raw RF spectrum captures and automated telecommunications intelligence.
        </p>
      </div>

      <div class="card p-8 mb-8" style="border: 1px solid var(--border-default); line-height: 1.7; color: var(--text-secondary); font-size: 0.95rem;">
        
        <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">1. The Problem We Address</h3>
        <p class="mb-6">
          RF engineers, spectrum monitors, and cybersecurity researchers capture gigabytes of IQ signals daily. However, analyzing unknown signals typically requires juggling multiple complex standalone DSP tools (such as GNU Radio, inspectrum, Audacity, and custom Python scripts) simply to answer fundamental questions: What is the carrier frequency? What is the modulation scheme? Where are the packet boundaries? What data is inside?
        </p>
        <p class="mb-6">
          This manual process is labor-intensive, error-prone, and requires deep specialized mathematical expertise for every individual capture.
        </p>

        <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">2. The SIGANALYZER Solution</h3>
        <p class="mb-6">
          <strong>SIGANALYZER</strong> unifies this fragmented toolchain into an automated, deterministic signal intelligence engine. By automating container detection, preconditioning, time/frequency analysis, cumulant-based modulation classification, Costas/Gardner synchronization, demodulation, and bitstream framing, SIGANALYZER transforms an hour-long manual workflow into an automated execution that takes seconds.
        </p>

        <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">3. Smart India Hackathon (SIH) Context</h3>
        <p class="mb-6">
          Developed as part of the <strong>Smart India Hackathon</strong>, SIGANALYZER was conceived to advance sovereign, open-architecture telecommunications and spectrum monitoring capabilities. The initiative emphasizes high-performance local processing, algorithmic transparency, and mathematical rigor.
        </p>

        <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">4. Core Engineering Principles</h3>
        <div class="grid grid-cols-1 md-grid-cols-2 gap-4 mt-4 mb-4">
          <div class="p-4 rounded" style="background: rgba(0, 0, 0, 0.3); border: 1px solid var(--border-subtle);">
            <div class="font-mono text-cyan font-bold mb-1">NO FABRICATION</div>
            <div style="font-size: 0.85rem;">Unavailable parameters are marked UNKNOWN rather than guessed. Results are backed by verified evidence.</div>
          </div>
          <div class="p-4 rounded" style="background: rgba(0, 0, 0, 0.3); border: 1px solid var(--border-subtle);">
            <div class="font-mono text-emerald font-bold mb-1">OFFLINE FIRST</div>
            <div style="font-size: 0.85rem;">Zero reliance on cloud clusters. Signals remain confidential and processable in air-gapped facilities.</div>
          </div>
          <div class="p-4 rounded" style="background: rgba(0, 0, 0, 0.3); border: 1px solid var(--border-subtle);">
            <div class="font-mono text-amber font-bold mb-1">DETERMINISTIC DSP</div>
            <div style="font-size: 0.85rem;">Standard mathematical transforms (Welch PSD, higher-order cumulants) provide reproducible outputs.</div>
          </div>
          <div class="p-4 rounded" style="background: rgba(0, 0, 0, 0.3); border: 1px solid var(--border-subtle);">
            <div class="font-mono text-indigo font-bold mb-1">PERMANENT ARCHIVES</div>
            <div style="font-size: 0.85rem;">All software releases remain permanently documented and accessible for forensic verification.</div>
          </div>
        </div>

      </div>

      <!-- Team & Development Placeholder -->
      <div class="card p-6" style="border: 1px solid var(--border-subtle); background: rgba(10, 14, 22, 0.6);">
        <div class="font-mono text-muted mb-2" style="font-size: 0.75rem; text-transform: uppercase;">TEAM & INITIATIVE CONTACT</div>
        <div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
          SIGANALYZER is developed by the Smart India Hackathon engineering team. Repository access, issue trackers, and technical documentation links will be updated in upcoming milestone releases.
        </div>
      </div>

    </main>
  `;
}
