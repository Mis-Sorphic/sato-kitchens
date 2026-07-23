// --- Sato Kitchens Assistant: a button-driven guided helper ---
// No AI API involved — this is a decision tree. Each "node" has a
// message and a list of options; picking an option jumps to another
// node (or performs an action, like linking to a page).

const assistantFlow = {
    start: {
        message: "Hi! I'm here to help you find the right service or get a quote. What would you like to do?",
        options: [
            { label: "See what services you offer", next: "services" },
            { label: "Get a quote", next: "quote_type" },
            { label: "Contact info", next: "contact" },
        ],
    },
    services: {
        message: "We offer four main categories: Kitchen Renovations, Bathrooms & Vanities, Stone Fabrication, and Additional Spaces (sculleries, prep areas, braai areas, staircases). Want to browse them?",
        options: [
            { label: "Browse Services page", link: "services.html" },
            { label: "Back to main menu", next: "start" },
        ],
    },
    quote_type: {
        message: "Great — what are you renovating?",
        options: [
            { label: "Kitchen", next: "quote_kitchen" },
            { label: "Bathroom", next: "quote_bathroom" },
            { label: "Outdoor space (braai, etc.)", next: "quote_outdoor" },
            { label: "Something else", next: "quote_other" },
        ],
    },
    quote_kitchen: {
        message: "We do full kitchen renovations, Infinity Kitchen fabrication, and Calacatta Gold countertops. Add whichever fits on the Services page, then request your quote from the cart via WhatsApp.",
        options: [
            { label: "Go to Services page", link: "services.html" },
            { label: "Back to main menu", next: "start" },
        ],
    },
    quote_bathroom: {
        message: "We do vanities (from US$300), quartz and granite countertops, and double basin setups. Add whichever fits on the Services page, then request your quote from the cart via WhatsApp.",
        options: [
            { label: "Go to Services page", link: "services.html" },
            { label: "Back to main menu", next: "start" },
        ],
    },
    quote_outdoor: {
        message: "We build custom braai areas with stone tops. Check it out on the Services page and add it to your cart to request a quote.",
        options: [
            { label: "Go to Services page", link: "services.html" },
            { label: "Back to main menu", next: "start" },
        ],
    },
    quote_other: {
        message: "No problem — we also do sculleries, prep areas, mitered granite, and staircase fabrication. Take a look at the Services page and add anything that fits, or message us directly on WhatsApp.",
        options: [
            { label: "Go to Services page", link: "services.html" },
            { label: "Message us on WhatsApp", link: "https://wa.me/263773855042" },
            { label: "Back to main menu", next: "start" },
        ],
    },
    contact: {
        message: "You can reach Sato Kitchens on WhatsApp at +263 77 385 5042, based in Harare, Zimbabwe.",
        options: [
            { label: "Message us on WhatsApp", link: "https://wa.me/263773855042" },
            { label: "Back to main menu", next: "start" },
        ],
    },
};

function renderAssistantNode(nodeKey) {
    const node = assistantFlow[nodeKey];
    const body = document.getElementById("assistantBody");

    // Assistant's message bubble
    const messageEl = document.createElement("div");
    messageEl.className = "assistant-bubble assistant-bot";
    messageEl.textContent = node.message;
    body.appendChild(messageEl);

    // Option buttons for this node
    const optionsEl = document.createElement("div");
    optionsEl.className = "assistant-options";

    node.options.forEach(function (option) {
        const btn = document.createElement("button");
        btn.className = "assistant-option-btn";
        btn.textContent = option.label;

        btn.addEventListener("click", function () {
            // Show the user's own choice as a bubble, like a real chat
            const userEl = document.createElement("div");
            userEl.className = "assistant-bubble assistant-user";
            userEl.textContent = option.label;
            body.appendChild(userEl);

            // Remove the buttons just clicked, so old choices aren't reusable
            optionsEl.remove();

            if (option.link) {
                if (option.link.startsWith("http")) {
                    window.open(option.link, "_blank");
                } else {
                    window.location.href = option.link;
                }
                return;
            }

            renderAssistantNode(option.next);
        });

        optionsEl.appendChild(btn);
    });

    body.appendChild(optionsEl);
    body.scrollTop = body.scrollHeight;
}

function buildAssistantWidget() {
    const root = document.createElement("div");
    root.id = "sato-assistant-root";
    root.innerHTML = `
        <button id="assistantToggle" class="assistant-toggle">💬</button>
        <div id="assistantPanel" class="assistant-panel">
            <div class="assistant-header">
                <span>Sato Kitchens Assistant</span>
                <span id="assistantClose" class="assistant-close">&times;</span>
            </div>
            <div id="assistantBody" class="assistant-body"></div>
        </div>
    `;
    document.body.appendChild(root);

    const toggle = document.getElementById("assistantToggle");
    const panel = document.getElementById("assistantPanel");
    const closeBtn = document.getElementById("assistantClose");

    toggle.addEventListener("click", function () {
        panel.classList.toggle("open");
    });

    closeBtn.addEventListener("click", function () {
        panel.classList.remove("open");
    });

    renderAssistantNode("start");
}

document.addEventListener("DOMContentLoaded", buildAssistantWidget);