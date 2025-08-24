// This function is called by the `onload` event on the Amplify script tag in index.html.
// It ensures that Amplify is fully loaded and available before our custom script runs.
function initializeApp() {
    // Basic check to ensure Amplify is indeed available
    if (!window.Amplify || !window.Amplify.Auth) {
        console.error('AWS Amplify failed to load globally.');
        // Display an error on the page if Amplify is not available
        const authStatus = document.getElementById('auth-status');
        if (authStatus) {
            setStatusMessage(authStatus, 'Error: AWS Amplify library failed to load. Please refresh the page or check your network connection.', 'error');
        }
        return; // Stop execution if Amplify is not loaded
    }

    // --- AWS Amplify Configuration ---
    // IMPORTANT: Replace these placeholder values with your actual AWS resource details.
    // You can find these in your AWS Amplify Console, Cognito Console, S3 Console, and API Gateway Console.
    const amplifyConfig = {
        Auth: {
            region: 'eu-north-1',
            userPoolId: 'eu-north-1_KN87MPQJj',
            userPoolWebClientId: 'd2fenvrgt56xmz', // Corrected: Ensure this matches your Cognito App Client ID exactly.
        },
        Storage: {
            AWSS3: {
                bucket: 'my-tax-documents-2025',
                region: 'eu-north-1', // Must be the same region as your S3 bucket
            }
        },
        API: {
            endpoints: [
                {
                    name: "TaxAdvisorAPI", // This name must match the API name you gave in API Gateway
                    endpoint: "https://wdchnry7n9.execute-api.eu-north-1.amazonaws.com/prod",
                    region: "eu-north-1" // Must be the same region as your API Gateway
                }
            ]
        }
    };

    // Configure Amplify with the consolidated config
    Amplify.configure(amplifyConfig);

    // --- UI Element References ---
    const authSection = document.getElementById('auth-section');
    const advisorSection = document.getElementById('advisor-section');
    const authStatus = document.getElementById('auth-status');
    const confirmSection = document.getElementById('confirm-section');
    const uploadStatus = document.getElementById('upload-status');
    const adviceOutput = document.getElementById('advice-output');

    // --- Helper Function for Status Messages ---
    function setStatusMessage(element, message, type = 'info', isLoading = false) {
        if (!element) {
            console.warn(`Attempted to set status on a non-existent element: ${message}`);
            return;
        }
        let bgColor, textColor, borderColor;
        switch (type) {
            case 'success': bgColor = 'bg-green-100'; textColor = 'text-green-800'; borderColor = 'border-green-500'; break;
            case 'error': bgColor = 'bg-red-100'; textColor = 'text-red-800'; borderColor = 'border-red-500'; break;
            default: bgColor = 'bg-blue-100'; textColor = 'text-blue-800'; borderColor = 'border-blue-500';
        }
        
        // Use innerHTML to allow for the loader spinner
        element.innerHTML = isLoading ? `<div class="flex items-center justify-center"><span class="loader"></span><span>${message}</span></div>` : message;
        element.className = `p-4 my-3 rounded-lg text-sm ${bgColor} ${textColor} border-l-4 ${borderColor}`;
        element.classList.remove('hidden');
    }

    // --- Authentication Logic ---
    document.getElementById('signup-btn').addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (!email || !password) return setStatusMessage(authStatus, 'Please enter both email and password.', 'error');
        setStatusMessage(authStatus, 'Signing up...', 'info', true);
        try {
            await Amplify.Auth.signUp({ username: email, password, attributes: { email } });
            setStatusMessage(authStatus, 'Sign up successful! Please check your email for a confirmation code.', 'success');
            confirmSection.classList.remove('hidden');
        } catch (error) {
            setStatusMessage(authStatus, `Sign up error: ${error.message}`, 'error');
        }
    });

    document.getElementById('confirm-btn').addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const code = document.getElementById('confirm-code').value;
        if (!code) return setStatusMessage(authStatus, 'Please enter the confirmation code.', 'error');
        setStatusMessage(authStatus, 'Confirming account...', 'info', true);
        try {
            await Amplify.Auth.confirmSignUp(email, code);
            setStatusMessage(authStatus, 'Email confirmed! You can now log in.', 'success');
            confirmSection.classList.add('hidden');
        } catch (error) {
            setStatusMessage(authStatus, `Confirmation error: ${error.message}`, 'error');
        }
    });

    document.getElementById('login-btn').addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (!email || !password) return setStatusMessage(authStatus, 'Please enter both email and password.', 'error');
        setStatusMessage(authStatus, 'Logging in...', 'info', true);
        try {
            await Amplify.Auth.signIn(email, password);
            setStatusMessage(authStatus, 'Logged in successfully!', 'success');
            checkSession(); // Update UI after successful login
        } catch (error) {
            setStatusMessage(authStatus, `Log in error: ${error.message}`, 'error');
        }
    });

    document.getElementById('logout-btn').addEventListener('click', async () => {
        try {
            await Amplify.Auth.signOut();
            setStatusMessage(authStatus, 'Logged out successfully.', 'info');
            checkSession(); // Update UI after logout
        } catch (error) {
            console.error('Error signing out: ', error);
            setStatusMessage(authStatus, `Logout error: ${error.message}`, 'error');
        }
    });

    document.getElementById('upload-btn').addEventListener('click', async () => {
        const fileInput = document.getElementById('file-input');
        const file = fileInput.files[0];
        if (!file) return setStatusMessage(uploadStatus, 'Please select a file to upload.', 'error');
        setStatusMessage(uploadStatus, `Uploading "${file.name}"...`, 'info', true);
        try {
            // Amplify Storage.put automatically handles S3 uploads.
            // 'level: private' ensures the file is accessible only by the authenticated user.
            await Amplify.Storage.put(file.name, file, { level: 'private', contentType: file.type });
            setStatusMessage(uploadStatus, `File "${file.name}" uploaded successfully! Processing initiated.`, 'success');
            fileInput.value = ''; // Clear the file input
        } catch (error) {
            setStatusMessage(uploadStatus, `Upload error: ${error.message}`, 'error');
        }
    });

    document.getElementById('get-advice-btn').addEventListener('click', async () => {
        setStatusMessage(adviceOutput, 'Generating tax advice... This might take a while as AI processes your data.', 'info', true);
        try {
            const session = await Amplify.Auth.currentSession();
            const currentUser = await Amplify.Auth.currentAuthenticatedUser();
            const userId = currentUser.username; // Cognito username is typically the email or a unique ID

            const response = await Amplify.API.post('TaxAdvisorAPI', '/advice', {
                body: { userId: userId }, // Pass userId in the body for the Lambda to use
                headers: { Authorization: session.getIdToken().getJwtToken() } // Automatically added by Amplify for API calls
            });
            
            if (response && response.tax_advice) {
                adviceOutput.innerText = response.tax_advice;
                adviceOutput.className = 'p-4 my-3 rounded-lg text-sm bg-green-100 text-green-800 border-l-4 border-green-500';
            } else {
                // If response is not as expected, stringify it for debugging
                adviceOutput.innerText = `Received an unexpected response from the AI advisor: ${JSON.stringify(response, null, 2)}`;
                adviceOutput.className = 'p-4 my-3 rounded-lg text-sm bg-red-100 text-red-800 border-l-4 border-red-500';
            }
        } catch (error) {
            console.error('Error getting advice:', error);
            setStatusMessage(adviceOutput, `Error generating advice: ${error.message}. Please ensure documents are uploaded and try again.`, 'error');
        }
    });

    // Function to check current session and update UI
    async function checkSession() {
        try {
            await Amplify.Auth.currentSession();
            // If a session exists, user is logged in
            authSection.classList.add('hidden');
            advisorSection.classList.remove('hidden');
            setStatusMessage(authStatus, 'You are logged in.', 'success');
        } catch (error) {
            // If no session, user is not logged in
            authSection.classList.remove('hidden');
            advisorSection.classList.add('hidden');
            setStatusMessage(authStatus, 'Please sign up or log in to continue.', 'info');
            console.log('No active session:', error);
        }
    }

    // Initial check when the app starts
    checkSession();
}