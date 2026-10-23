const LIVE_VIEWPORT_WIDTH = 1280;
// Reveal the preview even if a slow site never fires `load`, so the toggle can't get stuck.
const LIVE_LOAD_TIMEOUT_MS = 8000;

function setupLiveToggles() {
    const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
            const scale = entry.contentRect.width / LIVE_VIEWPORT_WIDTH;
            entry.target.style.setProperty("--live-scale", String(scale));
        }
    });

    for (const frame of document.querySelectorAll(".frame[data-live]")) {
        const button = frame.querySelector(".live-toggle");
        const screen = frame.querySelector(".screen");
        if (!button || !screen) continue;

        button.addEventListener("click", () => {
            const turningOn = button.getAttribute("aria-pressed") !== "true";
            button.setAttribute("aria-pressed", String(turningOn));

            if (!turningOn) {
                // Unload so a hidden preview doesn't keep running (audio, websockets, WebGL).
                screen.querySelector("iframe")?.remove();
                resizeObserver.unobserve(screen);
                frame.classList.remove("is-live", "is-loading");
                return;
            }

            const iframe = document.createElement("iframe");
            iframe.src = frame.dataset.live;
            iframe.title = button.getAttribute("aria-label") ?? "Live preview";
            iframe.referrerPolicy = "no-referrer";
            // Allow the site to run, but block popups and top-level navigation of this page.
            iframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms");

            const reveal = () => {
                if (!iframe.isConnected) return;
                frame.classList.remove("is-loading");
                frame.classList.add("is-live");
            };
            iframe.addEventListener("load", reveal, { once: true });
            setTimeout(reveal, LIVE_LOAD_TIMEOUT_MS);

            frame.classList.add("is-loading");
            screen.appendChild(iframe);
            resizeObserver.observe(screen);
        });
    }
}

function setupReveal() {
    const cards = document.querySelectorAll(".card");
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        },
        { rootMargin: "0px 0px -8% 0px" }
    );
    for (const card of cards) observer.observe(card);
}

function setupActiveNav() {
    const links = new Map();
    for (const link of document.querySelectorAll('.toc a[href^="#"]')) {
        links.set(link.getAttribute("href").slice(1), link);
    }

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                for (const link of links.values()) link.removeAttribute("aria-current");
                links.get(entry.target.id)?.setAttribute("aria-current", "true");
            }
        },
        { rootMargin: "-40% 0px -55% 0px" }
    );

    for (const id of links.keys()) {
        const target = document.getElementById(id);
        if (target) observer.observe(target);
    }
}

setupLiveToggles();
setupReveal();
setupActiveNav();
