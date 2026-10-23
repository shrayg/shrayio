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

setupReveal();
setupActiveNav();
