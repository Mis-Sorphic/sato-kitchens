// Where our FastAPI backend lives. Change this one line if the
// backend ever moves to a different port or a real domain.
const API_BASE = "http://127.0.0.1:8000";

// Small helper so we don't repeat this message-display logic twice
function showMessage(text, isError = true) {
    const messageBox = document.getElementById("message");
    messageBox.textContent = text;
    messageBox.className = isError ? "form-message error" : "form-message success";
}

// --- Registration ---
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // stop the browser's default full-page-reload submit

        const payload = {
            full_name: document.getElementById("full_name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value || null,
            password: document.getElementById("password").value,
        };

        try {
            const response = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                // FastAPI puts validation/error messages in "detail"
                showMessage(data.detail || "Something went wrong. Please try again.");
                return;
            }

            showMessage("Account created! Redirecting to sign in...", false);
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);

        } catch (err) {
            // This branch fires if the backend is unreachable entirely
            // (e.g. uvicorn isn't running, or CORS is misconfigured)
            showMessage("Couldn't reach the server. Is the backend running?");
        }
    });
}

// --- Login ---
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const payload = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
        };

        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                showMessage(data.detail || "Incorrect email or password.");
                return;
            }

            // Save the JWT so future pages can prove who's logged in.
            // localStorage persists across page loads/tabs until cleared.
            localStorage.setItem("sato_token", data.access_token);

            showMessage("Signed in! Redirecting...", false);
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);

        } catch (err) {
            showMessage("Couldn't reach the server. Is the backend running?");
        }
    });
}

// --- Reflect login state in the navbar, on every page ---
async function checkAuthState() {
    const navAuthItem = document.getElementById("navAuthItem");
    if (!navAuthItem) return; // this page has no nav auth slot, skip

    const token = localStorage.getItem("sato_token");
    if (!token) return; // nobody's logged in, leave "Sign In" as-is

    try {
        const response = await fetch(`${API_BASE}/me`, {
            headers: { "Authorization": `Bearer ${token}` },
        });

        if (!response.ok) {
            // Token's expired or invalid — clean up and leave as "Sign In"
            localStorage.removeItem("sato_token");
            return;
        }

        const user = await response.json();
        const firstName = user.full_name.split(" ")[0];

        navAuthItem.innerHTML = `
            <span class="nav-user">Hi, ${firstName}</span>
            <a href="#" id="signOutLink" class="sign-out-link">Sign Out</a>
        `;

        document.getElementById("signOutLink").addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("sato_token");
            window.location.href = "index.html";
        });

    } catch (err) {
        // Backend unreachable — fail quietly, just leave "Sign In" showing
    }
}

// Run this the moment the page's HTML is ready, on every page that loads auth.js
document.addEventListener("DOMContentLoaded", checkAuthState);