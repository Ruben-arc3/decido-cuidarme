(() => {
  const STORAGE_KEY = "decido-cuidarme-prank-simulation-until";
  const SESSION_DURATION = 45_000;
  const OVERLAY_DURATION = 11_000;
  let fallbackUntil = 0;
  let currentUntil = 0;
  let globalActiveUntil = 0;
  const currentPath = location.pathname.replace(/\/+$/, "");
  const canStopFromThisPage = currentPath.endsWith("/shutdown") || currentPath.endsWith("/shutdown.html");
  const channel = "BroadcastChannel" in window
    ? new BroadcastChannel("decido-cuidarme-prank-simulation")
    : null;

  const readUntil = () => {
    try {
      return Number(localStorage.getItem(STORAGE_KEY) || 0);
    } catch {
      return fallbackUntil;
    }
  };
  const writeUntil = (until) => {
    fallbackUntil = until;
    try {
      localStorage.setItem(STORAGE_KEY, String(until));
    } catch {
      // Keep the button usable in local previews where browser storage can be restricted.
    }
  };
  const clearUntil = () => {
    fallbackUntil = 0;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // No stored state to clear in restricted local previews.
    }
  };

  const publish = (message) => channel?.postMessage(message);

  const dismissOverlay = () => {
    document.querySelector("[data-prank-overlay]")?.remove();
    document.body.classList.remove("prank-simulation-active");
  };

  const stopSimulation = (broadcast = true) => {
    clearUntil();
    currentUntil = 0;
    dismissOverlay();
    const status = document.getElementById("launch-status");
    if (status) status.textContent = "Simulación detenida.";
    if (broadcast) {
      publish({ type: "stop" });
      if (canStopFromThisPage) void publishGlobalSignal(Date.now());
    }
  };

  const expireSimulation = (until) => {
    window.setTimeout(() => {
      if (currentUntil !== until || Date.now() < until) return;
      stopSimulation();
    }, Math.max(0, until - Date.now()));
  };

  const activateSimulation = (until, broadcast = false) => {
    currentUntil = until;
    if (broadcast) writeUntil(until);
    startOverlay();
    expireSimulation(until);
    if (broadcast) {
      publish({ type: "start", until });
      void publishGlobalSignal(until);
    }
  };

  const showGlobalSignalError = (error) => {
    console.error("No se pudo sincronizar shutdown con los demás dispositivos", error);
    const status = document.getElementById("launch-status");
    if (status) {
      status.textContent = "La pantalla solo se activó en este dispositivo. No se pudo guardar la señal global; revisa la conexión y las reglas de Firestore.";
    }
  };

  const globalSignalPromise = (async () => {
    const [{ firebaseConfig }, { initializeApp, getApps }, firestore] = await Promise.all([
      import("/js/suggestion-firebase-config.js"),
      import("https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js"),
    ]);
    const appName = "shutdown-global-signal";
    const app = getApps().find((candidate) => candidate.name === appName)
      || initializeApp(firebaseConfig, appName);
    const database = firestore.getFirestore(app);
    const signalRef = firestore.doc(database, "siteSignals", "shutdown");

    firestore.onSnapshot(
      signalRef,
      (snapshot) => {
        const nextUntil = snapshot.exists() ? Number(snapshot.data().activeUntil || 0) : 0;
        if (nextUntil > Date.now()) {
          globalActiveUntil = nextUntil;
          if (nextUntil > currentUntil) activateSimulation(nextUntil);
          return;
        }

        const stoppedUntil = globalActiveUntil;
        globalActiveUntil = 0;
        if (stoppedUntil && currentUntil === stoppedUntil) stopSimulation(false);
      },
      (error) => showGlobalSignalError(error),
    );

    return { database, signalRef, setDoc: firestore.setDoc, serverTimestamp: firestore.serverTimestamp };
  })().catch((error) => {
    showGlobalSignalError(error);
    return null;
  });

  async function publishGlobalSignal(activeUntil) {
    const firebase = await globalSignalPromise;
    if (!firebase) return;
    try {
      await firebase.setDoc(firebase.signalRef, {
        activeUntil,
        updatedAt: firebase.serverTimestamp(),
      });
      const status = document.getElementById("launch-status");
      if (status) status.textContent = activeUntil > Date.now()
        ? "Señal enviada a los dispositivos conectados."
        : "Señal detenida en los dispositivos conectados.";
    } catch (error) {
      showGlobalSignalError(error);
    }
  }

  const startOverlay = () => {
    if (!document.body || document.querySelector("[data-prank-overlay]")) return;

    const overlay = document.createElement("section");
    overlay.dataset.prankOverlay = "";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Inicio del sistema Linux");
    const stopControl = canStopFromThisPage
      ? '<button type="button" data-stop-simulation>Detener</button>'
      : "";
    overlay.innerHTML = `
      <style>
        .prank-simulation-active { overflow: hidden !important; }
        [data-prank-overlay] { position: fixed; z-index: 2147483000; inset: 0; display: grid; place-items: center; overflow: auto; padding: 20px; background: #050807f5; color: #a8f5bb; font: 15px/1.6 ui-monospace, SFMono-Regular, Consolas, monospace; animation: prank-in .25s ease-out both; }
        [data-prank-overlay] * { box-sizing: border-box; }
        [data-prank-overlay] .prank-window { position: relative; width: min(100%, 900px); padding: clamp(18px, 4vw, 34px); border: 1px solid #202722; border-radius: 3px; background: #030504; box-shadow: 0 0 60px #000; }
        [data-prank-overlay] .prank-log { height: min(68vh, 560px); min-height: 300px; margin: 0; padding: 8px; overflow: auto; background: #030504; color: #bbc7bd; font-size: clamp(11px, 2.5vw, 13px); line-height: 1.55; white-space: pre-wrap; scrollbar-width: thin; scrollbar-color: #39443b #030504; }
        [data-prank-overlay] .prank-progress { height: 7px; margin: 15px 0 20px; overflow: hidden; border-radius: 99px; background: #1c2b20; }
        [data-prank-overlay] .prank-progress span { display: block; width: 0; height: 100%; border-radius: inherit; background: #63e17d; box-shadow: 0 0 12px #63e17d; animation: prank-progress 8s linear forwards; }
        [data-prank-overlay] .prank-controls { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; }
        [data-prank-overlay] button { min-height: 32px; padding: 0 10px; border: 1px solid #303a32; border-radius: 3px; background: #0b0e0c; color: #9eaaa0; font: 11px ui-monospace, monospace; cursor: pointer; }
        [data-prank-overlay] button:hover { background: #171d19; color: #d8e2d9; }
        [data-prank-overlay] button:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
        @keyframes prank-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes prank-progress { to { width: 100%; } }
        @media (prefers-reduced-motion: reduce) { [data-prank-overlay] *, [data-prank-overlay] *::before { animation-duration: .01ms !important; animation-iteration-count: 1 !important; } }
      </style>
      <div class="prank-window">
        <pre class="prank-log" aria-live="polite"></pre>
        <div class="prank-progress" aria-hidden="true"><span></span></div>
        ${stopControl ? `<div class="prank-controls"><span aria-hidden="true"></span>${stopControl}</div>` : ""}
      </div>`;
    document.body.append(overlay);
    document.body.classList.add("prank-simulation-active");

    const log = overlay.querySelector(".prank-log");
    const lines = [
      "[    0.000000] Linux version 6.8.0-generic (buildd@lcy02-amd64) x86_64",
      "[    0.000000] Command line: BOOT_IMAGE=/boot/vmlinuz root=UUID=system ro quiet",
      "[    0.000000] BIOS-provided physical RAM map:",
      "[    0.000000] Memory: 8192000K/8388608K available",
      "[    0.000000] x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'",
      "[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable",
      "[    0.000000] printk: console [tty0] enabled",
      "[    0.003412] ACPI: Early table checksum verification disabled",
      "[    0.018250] smpboot: Allowing 4 CPUs, 0 hotplug CPUs",
      "[    0.026144] Memory: 8072140K/8388608K available",
      "[    0.041709] Kernel command line parsed successfully",
      "[    0.072192] PCI: Using configuration type 1 for base access",
      "[    0.094510] clocksource: tsc-early: mask: 0xffffffffffffffff",
      "[    0.121442] Mount-cache hash table entries: 16384",
      "[    0.148201] NET: Registered PF_NETLINK/PF_ROUTE protocol family",
      "[    0.176450] audit: initializing netlink subsys (disabled)",
      "[    0.203819] Initialise system trusted keyrings",
      "[    0.231702] Key type blacklist registered",
      "[    0.259180] AppArmor: AppArmor initialized",
      "[    0.287943] random: crng init done",
      "[    0.314501] usbcore: registered new interface driver usbfs",
      "[    0.342188] usbcore: registered new interface driver hub",
      "[    0.370102] usbcore: registered new device driver usb",
      "[    0.397710] PCI: Using ACPI for IRQ routing",
      "[    0.425688] clocksource: Switched to clocksource tsc-early",
      "[    0.453105] VFS: Disk quotas dquot_6.6.0",
      "[    0.480241] EXT4-fs (sda1): mounted filesystem with ordered data mode",
      "[    0.508830] systemd[1]: systemd 255.4 running in system mode",
      "[    0.536250] systemd[1]: Detected architecture x86-64.",
      "[  OK  ] Created slice system-getty.slice - Slice /system/getty.",
      "[  OK  ] Created slice system-modprobe.slice - Slice /system/modprobe.",
      "[  OK  ] Created slice user.slice - User and Session Slice.",
      "[  OK  ] Started systemd-ask-password-console.path - Dispatch Password Requests to Console.",
      "[  OK  ] Set up automount proc-sys-fs-binfmt_misc.automount.",
      "[  OK  ] Reached target cryptsetup.target - Local Encrypted Volumes.",
      "[  OK  ] Reached target paths.target - Path Units.",
      "[  OK  ] Reached target remote-fs.target - Remote File Systems.",
      "[  OK  ] Reached target slices.target - Slice Units.",
      "[  OK  ] Reached target swap.target - Swaps.",
      "[  OK  ] Listening on systemd-journald-dev-log.socket - Journal Socket.",
      "[  OK  ] Listening on systemd-journald.socket - Journal Socket.",
      "[  OK  ] Listening on systemd-udevd-control.socket - udev Control Socket.",
      "[  OK  ] Listening on systemd-udevd-kernel.socket - udev Kernel Socket.",
      "[  OK  ] Mounting dev-hugepages.mount - Huge Pages File System.",
      "[  OK  ] Mounting dev-mqueue.mount - POSIX Message Queue File System.",
      "[  OK  ] Mounting sys-kernel-debug.mount - Kernel Debug File System.",
      "[  OK  ] Starting systemd-journald.service - Journal Service...",
      "[  OK  ] Started systemd-journald.service - Journal Service.",
      "[  OK  ] Starting systemd-udevd.service - Rule-based Manager for Device Events...",
      "[  OK  ] Started systemd-udevd.service - Rule-based Manager for Device Events.",
      "[  OK  ] Starting systemd-modules-load.service - Load Kernel Modules...",
      "[  OK  ] Started systemd-modules-load.service - Load Kernel Modules.",
      "[  OK  ] Starting systemd-remount-fs.service - Remount Root and Kernel File Systems...",
      "[  OK  ] Started systemd-remount-fs.service - Remount Root and Kernel File Systems.",
      "[  OK  ] Starting systemd-random-seed.service - Load/Save Random Seed...",
      "[  OK  ] Started systemd-random-seed.service - Load/Save Random Seed.",
      "[  OK  ] Starting systemd-sysctl.service - Apply Kernel Variables...",
      "[  OK  ] Started systemd-sysctl.service - Apply Kernel Variables.",
      "[  OK  ] Starting systemd-tmpfiles-setup-dev.service - Create Static Device Nodes...",
      "[  OK  ] Started systemd-tmpfiles-setup-dev.service - Create Static Device Nodes.",
      "[  OK  ] Starting systemd-tmpfiles-setup.service - Create Volatile Files and Directories...",
      "[  OK  ] Started systemd-tmpfiles-setup.service - Create Volatile Files and Directories.",
      "[  OK  ] Starting systemd-networkd.service - Network Configuration...",
      "[  OK  ] Started systemd-networkd.service - Network Configuration.",
      "[  OK  ] Starting systemd-resolved.service - Network Name Resolution...",
      "[  OK  ] Started systemd-resolved.service - Network Name Resolution.",
      "[  OK  ] Starting systemd-logind.service - User Login Management...",
      "[  OK  ] Started systemd-logind.service - User Login Management.",
      "[  OK  ] Starting cron.service - Regular background program processing daemon...",
      "[  OK  ] Started cron.service - Regular background program processing daemon.",
      "[  OK  ] Starting dbus.service - D-Bus System Message Bus...",
      "[  OK  ] Started dbus.service - D-Bus System Message Bus.",
      "[  OK  ] Starting NetworkManager.service - Network Manager...",
      "[  OK  ] Started NetworkManager.service - Network Manager.",
      "[  OK  ] Reached target network.target - Network.",
      "[  OK  ] Reached target network-online.target - Network is Online.",
      "[  OK  ] Starting systemd-user-sessions.service - Permit User Sessions...",
      "[  OK  ] Started systemd-user-sessions.service - Permit User Sessions.",
      "[  OK  ] Started getty@tty1.service - Getty on tty1.",
      "[  OK  ] Reached target multi-user.target - Multi-User System.",
      "[  OK  ] Reached target graphical.target - Graphical Interface.",
      "localhost login:",
    ];
    let lineIndex = 0;
    const typeLine = () => {
      if (!log.isConnected || lineIndex >= lines.length) return;
      log.textContent += `${lineIndex ? "\n" : ""}${lines[lineIndex++]}`;
      log.scrollTop = log.scrollHeight;
      if (lineIndex < lines.length) window.setTimeout(typeLine, 55);
    };
    typeLine();
    overlay.querySelector("[data-stop-simulation]")?.addEventListener("click", stopSimulation);
    window.setTimeout(() => {
      if (overlay.isConnected) dismissOverlay();
    }, OVERLAY_DURATION);
  };

  const launchButton = document.querySelector("[data-start-simulation]");
  if (launchButton) {
    launchButton.addEventListener("click", () => {
      const until = Date.now() + SESSION_DURATION;
      activateSimulation(until, true);
    });
  }

  const activeUntil = readUntil();
  if (activeUntil > Date.now()) activateSimulation(activeUntil);
  else if (activeUntil) clearUntil();

  channel?.addEventListener("message", (event) => {
    if (event.data?.type === "start" && Number(event.data.until) > Date.now()) {
      activateSimulation(Number(event.data.until));
    } else if (event.data?.type === "stop") {
      stopSimulation(false);
    }
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    const until = Number(event.newValue || 0);
    if (until > Date.now()) activateSimulation(until);
    else stopSimulation(false);
  });

  document.addEventListener("keydown", (event) => {
    if (canStopFromThisPage && event.key === "Escape" && document.querySelector("[data-prank-overlay]")) {
      stopSimulation();
    }
  });
})();
