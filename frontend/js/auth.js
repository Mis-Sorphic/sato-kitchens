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