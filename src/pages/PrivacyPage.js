/**
 * SIGANALYZER PrivacyPage
 * Clear technical statement of the offline-first data handling philosophy.
 */

export function renderPrivacyPage() {
  return `
    <main class="container" style="padding-top: calc(var(--nav-height) + 2.5rem); padding-bottom: 5rem; max-width: 860px;">
      
      <div class="mb-10">
        <div class="badge badge-emerald mb-3">DATA PRIVACY & SYSTEM INTEGRITY</div>
        <h1 class="hero-title mb-4" style="font-size: clamp(2rem, 4vw, 3rem);">
          Offline-First Technical Privacy Policy
        </h1>
        <p class="section-desc" style="font-size: 1.1rem;">
          How SIGANALYZER handles raw signal captures, local disk storage, and network interfaces.
        </p>
      </div>

      <div class="card p-8" style="border: 1px solid var(--border-default); line-height: 1.7; color: var(--text-secondary); font-size: 0.95rem;">
        
        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">1. Technical Operating Model</h3>
        <p class="mb-6">
          SIGANALYZER is distributed as an offline-first desktop application. Its computational core is designed to process <span class="code-inline">.iq</span> and <span class="code-inline">.wav</span> files directly on the host computer's hardware (CPU, SIMD vector units, and local GPU acceleration).
        </p>

        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">2. Zero Signal Data Transmission</h3>
        <p class="mb-6">
          Under no circumstances does SIGANALYZER transmit raw IQ samples, demodulated bitstreams, decoded packets, or extracted technical parameters to external servers, cloud databases, or third-party APIs. All digital signal processing is confined strictly to local process memory.
        </p>

        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">3. No Mandatory User Accounts</h3>
        <p class="mb-6">
          SIGANALYZER does not require user registration, email login, or authentication tokens to analyze signals. There are no user tracking cookies or behavioral session collectors embedded within the application or this documentation website.
        </p>

        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">4. Air-Gapped & Shielded Environment Support</h3>
        <p class="mb-6">
          The software is architected to run seamlessly on computers with zero network adapters, disabled network interfaces, or inside RF-shielded Faraday chambers. No internet access is queried for activation or operation.
        </p>

        <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">5. Local Report Generation</h3>
        <p class="mb-6">
          When forensic HTML or PDF summary reports are exported, they are compiled and rendered locally using client-side rendering engines. The generated files are saved solely to the local directory chosen by the user.
        </p>

        <div class="p-4 rounded-md" style="background: rgba(16, 185, 129, 0.08); border: 1px solid var(--border-accent-emerald); font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-emerald);">
          COMMITMENT: This website and the SIGANALYZER platform maintain an absolute technical separation between signal reverse-engineering workflows and public network infrastructure.
        </div>

      </div>

    </main>
  `;
}
