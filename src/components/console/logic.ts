import { onMounted, ref } from "vue";

const BOOT_LINES = [
  "BOOT SEQUENCE INITIATED...",
  "LOADING MODULES: [OK] [OK] [OK] [OK] ACCESS LEVEL: AUTHORIZED",
  "NETWORK: ACTIVE — 192.168.0.42",
];

export function useConsole() {
  const input = ref("");
  const status = ref("online");
  const outputRef = ref<HTMLElement | null>(null);
  const inputRef = ref<HTMLInputElement | null>(null);
  const version = ref(0.1);

  onMounted(() => {
    inputRef.value?.focus();
    setTimeout(() => typeBootSequence(0), 600);
    setInterval(() => {
      status.value = Math.random() > 0.2 ? "online" : "syncing";
    }, 3000);
  });

  const initialize = () => {
    inputRef.value?.focus();
    setTimeout(() => typeBootSequence(0), 600);
    setInterval(() => {
      status.value = Math.random() > 0.2 ? "Online" : "Syncing";
    }, 3000);
  };

  const scrollToBottom = () => {
    if (outputRef.value) {
      outputRef.value.scrollTop = outputRef.value.scrollHeight;
    }
  };

  const addLine = (text: string, isFlicker = false) => {
    const line = document.createElement("div");
    line.className = isFlicker ? "line flicker" : "line";
    line.textContent = text;
    outputRef.value?.appendChild(line);
    scrollToBottom();
    return line;
  };

  const typeLine = (text: string, speed = 20, callback?: () => void) => {
    const line = document.createElement("div");
    line.className = "line flicker";

    const textNode = document.createTextNode("");
    const cursor = document.createElement("span");
    cursor.className = "cursor";

    line.append(textNode, cursor);
    outputRef.value?.appendChild(line);

    let i = 0;
    const type = () => {
      textNode.textContent = text.slice(0, i++);
      scrollToBottom();

      if (i <= text.length) {
        setTimeout(type, speed + Math.random() * 60);
      } else {
        cursor.remove();
        callback?.();
      }
    };
    type();
  };

  const typeBootSequence = (index: number) => {
    if (index >= BOOT_LINES.length) return;
    typeLine(BOOT_LINES[index], 1, () => {
      setTimeout(() => typeBootSequence(index + 1), 200);
    });
  };

  const parseCommand = (cmdString: string) => {
    const parts = cmdString.trim().toLowerCase().split(/\s+/);
    const mainCmd = parts[0];
    const subCmd = parts[1];
    const args = parts.slice(2);

    return { mainCmd, subCmd, args, raw: parts };
  };

  const runBassModule = () => {
    const dots = addLine("", true);
    let count = 0;

    const interval = setInterval(() => {
      dots.textContent = ". ".repeat(++count);
      scrollToBottom();

      if (count >= 3) {
        clearInterval(interval);
        setTimeout(() => addLine("Bass erfolgreich gestartet."), 600);
        setTimeout(() => {
          const errorLine = addLine("Error! Unsupported Operation!", true);
          errorLine.style.color = "#ff0000";
        }, 2000);
        setTimeout(() => {
          if (outputRef.value) {
            outputRef.value.innerHTML = "";
          }
          setTimeout(() => typeBootSequence(0), 800);
        }, 4000);
      }
    }, 500);
  };

  const handleCommand = () => {
    const rawInput = input.value.trim().toLowerCase();
    if (!rawInput) return;

    addLine(`> ${rawInput}`);

    const { mainCmd, subCmd, args, raw } = parseCommand(rawInput);

    if (mainCmd === "run") {
      if (!subCmd || subCmd === "help") {
        addLine("Verfügbare Module:");
        addLine("run_ ");
        addLine("  - admin");
        addLine("  - bass");
        addLine("  - fallout");
        addLine("get_ ");
        addLine(" - <bauwerknummer>");
        addLine("show_ ");
        addLine("  - status");
        addLine("  - modules");
        addLine("  - system");
        addLine("search_ ");
        addLine(" - <begriff>");
        addLine("post_ ");
        addLine(" - <daten>");
      } else if (subCmd === "bass") {
        typeLine(mainCmd);
        runBassModule();
      } else if (subCmd === "admin") {
        addLine("Admin-Modus wird initialisiert...");
        typeLine("ADMIN WIRD GELADEN", 15);
        setTimeout(() => addLine("Zugriff gewährt. Admin-Rechte aktiv."), 1500);
      } else if (subCmd === "fallout") {
        addLine("Fallout-Protokoll wird geladen...");
        setTimeout(
          () => addLine("Warnung: Strahlungswerte erhöht. System bereit."),
          800
        );
        setTimeout(() => {
          typeLine(
            "Strahlung erhöht.\n" +
              "Strahlung weiter erhöht.\n" +
              "  \n" +
              "Strahlungsdosis überschreitet kritischen Wert.\n" +
              "Bevorstehendes Risiko einer Zellmutation erwartet.\n" +
              "   \n" +
              "      \n" +
              "Kritischer Strahlenwert überschritten. \n" +
              "Point of no Return.                       \n" +
              "Mutationen ausstehend\n" +
              "Lade Fallout Shelter Protokol\n" +
              "0% \n" +
              "24% \n" +
              "41% \n" +
              "60% \n" +
              "79% \n" +
              "88% \n" +
              "                        \n" +
              "88%       \n" +
              "        \n" +
              " \n" +
              "... ladevorgang abgebrochen\n" +
              "Bitte Systemadministrator kontaktieren... \n" +
              " \n\n\n\n\n",
            50
          );
        }, 1000);
      } else {
        addLine(`Fehler: Unbekanntes Modul '${subCmd}'`);
        addLine("Nutze 'run help' für verfügbare Module.");
      }
    }

    // GET Befehle
    else if (mainCmd === "get") {
      if (!subCmd) {
        addLine("Fehler: Keine Bauwerksnummer angegeben.");
        addLine("Verwendung: get <bauwerksnummer>");
        addLine("Beispiel: ", true);
        typeLine("get 40/1000", 100);
      } else {
        const bauwerksNr = raw.slice(1).join(" ");
        addLine(`Lade Bauwerk ${bauwerksNr}...`);
        setTimeout(() => {
          addLine(`Bauwerk ${bauwerksNr}: Daten erfolgreich abgerufen.`);
          addLine(`Status: Aktiv | Typ: Brücke | Baujahr: 2045`);
        }, 1200);
      }
    }

    // SHOW Befehle
    else if (mainCmd === "show") {
      if (!subCmd) {
        addLine("Verfügbare Show-Befehle:");
        addLine("  - show status");
        addLine("  - show modules");
        addLine("  - show system");
      } else if (subCmd === "status") {
        addLine("System Status: ONLINE");
        addLine("CPU: 34% | RAM: 2.1/8.0 GB | NETZWERK: AKTIV");
      } else if (subCmd === "modules") {
        addLine("Geladene Module: admin, bass, fallout");
      } else if (subCmd === "system") {
        addLine("FALLOUT-OS v1.0");
        addLine("Kernel: 3077.42-fallout");
        addLine("Uptime: 42 Tage, 13 Stunden");
      } else {
        addLine(`Fehler: Unbekannter Show-Parameter '${subCmd}'`);
      }
    }

    // SEARCH Befehle
    else if (mainCmd === "search") {
      if (!subCmd) {
        addLine("Fehler: Suchbegriff fehlt.");
        addLine("Verwendung: search <begriff>");
      } else {
        const searchTerm = raw.slice(1).join(" ");
        addLine(`Suche nach '${searchTerm}'...`);
        setTimeout(() => {
          addLine(`3 Ergebnisse gefunden für '${searchTerm}'`);
          addLine("  [1] Dokument_${searchTerm}_001.txt");
          addLine("  [2] Archiv_${searchTerm}_beta.log");
          addLine("  [3] Backup_${searchTerm}_final.dat");
        }, 1000);
      }
    }

    // POST Befehle
    else if (mainCmd === "post") {
      if (!subCmd) {
        addLine("Fehler: Keine Daten zum Senden angegeben.");
        addLine("Verwendung: post <daten>");
      } else {
        const data = raw.slice(1).join(" ");
        addLine(`Sende Daten: ${data}`);
        setTimeout(() => {
          addLine("Übertragung erfolgreich. Server antwortet: 200 OK");
        }, 800);
      }
    }

    // Unbekannter Befehl
    else {
      addLine(`Fehler: Unbekannter Befehl '${mainCmd}'`);
      addLine("Verfügbare Befehle: run, get, show, search, post");
      addLine("Nutze 'run help' für mehr Informationen.");
    }

    input.value = "";
  };
  return {
    input,
    status,
    version,
    outputRef,
    inputRef,

    handleCommand,
    initialize,
  };
}
