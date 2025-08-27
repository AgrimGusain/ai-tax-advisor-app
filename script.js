// Load Amplify from the CDN global
const { Amplify, Auth, Storage, API } = aws_amplify;

// Configure Amplify
Amplify.configure({
    Auth: {
        region: "eu-north-1",
        userPoolId: "eu-north-1_KN87MPQJj",
        userPoolWebClientId: "6d2fenvrgt56xmz",
    },
    Storage: {
        AWSS3: {
            bucket: "my-tax-documents-2025",
            region: "eu-north-1",
        },
    },
    API: {
        endpoints: [
            {
                name: "TaxAdvisorAPI",
                endpoint: "https://wdchnry7n9.execute-api.eu-north-1.amazonaws.com/prod",
                region: "eu-north-1",
            },
        ],
    },
});

console.log("AWS Amplify configured successfully");

function initializeApp() {
    const authSection = document.getElementById("auth-section");
    const advisorSection = document.getElementById("advisor-section");
    const authStatus = document.getElementById("auth-status");
    const confirmSection = document.getElementById("confirm-section");
    const uploadStatus = document.getElementById("upload-status");
    const adviceOutput = document.getElementById("advice-output");

    function setStatusMessage(element, message, type = "info") {
        if (element) {
            element.innerHTML = message;
            element.className = `status-message ${type}`;
            element.classList.remove("hidden");
        }
    }

    function hideStatusMessage(element) {
        if (element) {
            element.classList.add("hidden");
        }
    }

    // === Sign Up ===
    document.getElementById("signup-btn").addEventListener("click", async () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            setStatusMessage(authStatus, "Please enter both email and password.", "error");
            return;
        }

        setStatusMessage(authStatus, "Signing up...", "info");
        try {
            await Auth.signUp({ username: email, password, attributes: { email } });
            setStatusMessage(authStatus, "Sign up successful! Check your email for a confirmation code.", "success");
            confirmSection.classList.remove("hidden");
        } catch (error) {
            setStatusMessage(authStatus, `Sign up error: ${error.message}`, "error");
        }
    });

    // === Confirm Sign Up ===
    document.getElementById("confirm-btn").addEventListener("click", async () => {
        const email = document.getElementById("email").value;
        const code = document.getElementById("confirm-code").value;

        if (!code) {
            setStatusMessage(authStatus, "Please enter the confirmation code.", "error");
            return;
        }

        setStatusMessage(authStatus, "Confirming account...", "info");
        try {
            await Auth.confirmSignUp(email, code);
            setStatusMessage(authStatus, "Email confirmed! You can now log in.", "success");
            confirmSection.classList.add("hidden");
        } catch (error) {
            setStatusMessage(authStatus, `Confirmation error: ${error.message}`, "error");
        }
    });

    // === Log In ===
    document.getElementById("login-btn").addEventListener("click", async () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
            setStatusMessage(authStatus, "Please enter both email and password.", "error");
            return;
        }

        setStatusMessage(authStatus, "Logging in...", "info");
        try {
            await Auth.signIn(email, password);
            authSection.classList.add("hidden");
            advisorSection.classList.remove("hidden");
            hideStatusMessage(authStatus);
        } catch (error) {
            setStatusMessage(authStatus, `Log in error: ${error.message}`, "error");
        }
    });

    // === Log Out ===
    document.getElementById("logout-btn").addEventListener("click", async () => {
        try {
            await Auth.signOut();
            authSection.classList.remove("hidden");
            advisorSection.classList.add("hidden");
            setStatusMessage(authStatus, "You have been logged out.", "info");
        } catch (error) {
            setStatusMessage(authStatus, `Logout error: ${error.message}`, "error");
        }
    });

    // === File Upload ===
    document.getElementById("upload-btn").addEventListener("click", async () => {
        const fileInput = document.getElementById("file-input");
        const file = fileInput.files[0];

        if (!file) {
            setStatusMessage(uploadStatus, "Please select a file to upload.", "error");
            return;
        }

        setStatusMessage(uploadStatus, `Uploading "${file.name}"...`, "info");
        try {
            await Storage.put(file.name, file, { level: "private", contentType: file.type });
            setStatusMessage(uploadStatus, "File uploaded successfully!", "success");
            fileInput.value = "";
        } catch (error) {
            setStatusMessage(uploadStatus, `Upload error: ${error.message}`, "error");
        }
    });

    // === Get Tax Advice ===
    document.getElementById("get-advice-btn").addEventListener("click", async () => {
        setStatusMessage(adviceOutput, "Generating tax advice... This may take a moment.", "info");
        try {
            const response = await API.post("TaxAdvisorAPI", "/advice", {});
            if (response && response.tax_advice) {
                setStatusMessage(adviceOutput, response.tax_advice.replace(/\n/g, "<br>"), "success");
            } else {
                setStatusMessage(adviceOutput, "Received a response, but it was empty. Please try again.", "info");
            }
        } catch (error) {
            setStatusMessage(adviceOutput, `Error generating advice: ${error.message}`, "error");
        }
    });

    // === Initial Session Check ===
    async function checkSession() {
        try {
            await Auth.currentAuthenticatedUser();
            authSection.classList.add("hidden");
            advisorSection.classList.remove("hidden");
        } catch {
            authSection.classList.remove("hidden");
            advisorSection.classList.add("hidden");
        }
    }

    checkSession();
}

document.addEventListener("DOMContentLoaded", initializeApp);
