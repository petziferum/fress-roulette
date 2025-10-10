<template>
  <div class="console">
    <div class="console-inner">
      <div class="console-header">
        <div class="led"></div>
        <div class="title">TRAINING-TERMINAL</div>
        <div class="version">V{{ version }}</div>
      </div>

      <div
        ref="outputRef"
        class="output"
        role="log"
        aria-label="console output"
      ></div>

      <div class="input-line">
        <span class="prompt">&gt; </span>
        <input
          ref="inputRef"
          v-model="input"
          type="text"
          class="inputfield"
          @keydown.enter="handleCommand"
          autocomplete="off"
        />
      </div>

      <div class="console-footer">
        <div>FALLOUT-OS © 3077</div>
        <div class="status">
          status: <span>{{ status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConsole } from "@/components/console/logic";

const { version, handleCommand, status, input, outputRef, inputRef } =
  useConsole();
</script>

<style>
:root {
  --bg: #112323;
  --bg-rad: #031107;
  --console-bg: #1c4415;
  --glow: #00ff2d;
  --dim-glow: rgba(0, 255, 102, 0.15);
  --text: #a3ff13;
  --font-size: 14px;
}

.console {
  width: min(1100px, 95vw);
  height: 65vh;
  max-height: 720px;
  background: radial-gradient(
    ellipse at top left,
    var(--console-bg) 10%,
    var(--bg-rad) 70%
  );
  border-radius: 8px;
  box-shadow: 0 0 80px rgba(0, 255, 102, 0.2), inset 0 0 200px rgba(0, 0, 0, 1);
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(0, 255, 102, 0.5);
}

/* Scanlines */
.console::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(
    0deg,
    rgba(0, 255, 102, 0.02) 0px,
    rgba(0, 255, 102, 0.02) 1px,
    transparent 2px,
    transparent 3px
  );
  opacity: 0.4;
}
.line {
  display: block;
  white-space: pre;
  line-height: 1.4;
}

/* Eingabezeile */
.input-line {
  display: flex;
  align-items: center;
  font-family: monospace;
  font-size: var(--font-size);
  color: var(--glow);
}
.prompt {
  margin-right: 4px;
}
.inputfield {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--glow);
  outline: none;
  font-family: monospace;
  font-size: var(--font-size);
  text-shadow: 0 0 6px var(--glow);
  caret-color: var(--glow);
}

/* Innenbereich */
.console-inner {
  position: relative;
  height: 100%;
  padding: 20px 28px;
  color: var(--text);
  font-size: var(--font-size);
  line-height: 1.45;
  text-shadow: 0 0 6px rgba(91, 231, 0, 0.9), 0 0 8px rgba(123, 255, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Header */
.console-header {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 6px;
  font-weight: 600;
  color: var(--glow);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.led {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--glow);
  box-shadow: 0 0 10px var(--glow), 0 0 30px rgba(0, 255, 102, 0.9);
}
.version {
  opacity: 0.5;
  margin-left: auto;
  font-weight: 500;
  font-size: 13px;
}

/* Output */
.output {
  margin: 0;
  padding: 12px 14px;
  background: transparent;
  overflow: auto;
  flex: 1 1 auto;
  white-space: pre-wrap;
  font-family: inherit;
  border: 1px solid rgba(0, 255, 102, 0.2);
  box-shadow: inset 0 0 30px rgba(0, 255, 102, 0.05);
}
.output span.line {
  display: block;
  color: var(--glow);
  text-shadow: 0 0 2px var(--glow), 0 0 6px var(--glow),
    0 0 30px rgba(0, 255, 102, 0.5);
}

/* Cursor */
.cursor {
  display: inline-block;
  width: 10px;
  height: 1.2em;
  background: var(--glow);
  box-shadow: 0 0 8px var(--glow), 0 0 10px var(--glow);
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

/* Flicker */
.flicker {
  animation: flicker 6s infinite;
}
@keyframes flicker {
  0% {
    opacity: 1;
  }
  10% {
    opacity: 0.9;
  }
  100% {
    opacity: 1;
  }
}

/* Footer */
.console-footer {
  font-size: 12px;
  opacity: 0.7;
  display: flex;
  justify-content: space-between;
  font-family: monospace;
}
</style>
updatesslcertificate.bat C:\Zertifikate\2025\cert_bgsdswik001_2025_key.pfx
BAU_ITV_ZERT_bgsdswik001 cert_bgsdswik001_2025
