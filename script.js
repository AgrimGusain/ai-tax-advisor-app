// --- AWS Amplify Configuration ---
// IMPORTANT: Replace these placeholder values with your actual AWS resource details.
// You can find these in your AWS Amplify Console, Cognito Console, S3 Console, and API Gateway Console.
const amplifyConfig = {
    Auth: {
        region: 'eu-north-1', // e.g., 'us-east-1', 'eu-north-1'
        userPoolId: 'eu-north-1_KN87MPQJj', // e.g., 'eu-north-1_xxxxxxxxx'
        userPoolWebClientId: 'd2fenvrgt56xmz', // Corrected: Removed extra spaces. e.g., 'xxxxxxxxxxxxxxxxx'
    },
    Storage: {
        AWSS3: {
            bucket: 'my-tax-documents-2025', // e.g., 'my-tax-documents-2025'
            region: 'eu-north-1', // Must be the same region as your S3 bucket
        }
    },
    API: {
        endpoints: [
            {
                name: "TaxAdvisorAPI", // This name must match the API name you gave in API Gateway
                endpoint: "https://wdchnry7n9.execute-api.eu-north-1.amazonaws.com/prod", // e.g., 'https://xxxxxxx.execute-api.eu-north-1.amazonaws.com/prod'
                region: "eu-north-1" // Must be the same region as your API Gateway
            }
        ]
    }
};
Amplify.configure(amplifyConfig);

// --- UI Element References ---
const authSection = document.getElementById('auth-section');
const advisorSection = document.getElementById('advisor-section');
const authStatus = document.getElementById('auth-status');
const confirmSection = document.getElementById('confirm-section');
const uploadStatus = document.getElementById('upload-status');
const adviceOutput = document.getElementById('advice-output');

// --- Helper Function for Status Messages ---
function setStatusMessage(element, message, type = 'info') {
    element.innerText = message;
    element.className = `status-message ${type}`; // Apply CSS class for styling
    element.classList.remove('hidden');
}

// --- Authentication Logic ---
document.getElementById('signup-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    setStatusMessage(authStatus, 'Signing up...', 'info');
    try {
        await Amplify.Auth.signUp({
            username: email,
            password: password,
            attributes: { email }
        });
        setStatusMessage(authStatus, 'Sign up successful! Please confirm your email.', 'success');
        confirmSection.classList.remove('hidden');
    } catch (error) {
        setStatusMessage(authStatus, `Sign up error: ${error.message}`, 'error');
    }
});

document.getElementById('confirm-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const code = document.getElementById('confirm-code').value;
    setStatusMessage(authStatus, 'Confirming account...', 'info');
    try {
        await Amplify.Auth.confirmSignUp({ username: email, confirmationCode: code });
        setStatusMessage(authStatus, 'Email confirmed! You can now log in.', 'success');
        confirmSection.classList.add('hidden');
    } catch (error) {
        setStatusMessage(authStatus, `Confirmation error: ${error.message}`, 'error');
    }
});

document.getElementById('login-btn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    setStatusMessage(authStatus, 'Logging in...', 'info');
    try {
        await Amplify.Auth.signIn({ username: email, password: password });
        setStatusMessage(authStatus, 'Logged in successfully!', 'success');
        authSection.classList.add('hidden');
        advisorSection.classList.remove('hidden');
        checkSession(); // Re-check session to ensure UI state is correct
    } catch (error) {
        setStatusMessage(authStatus, `Log in error: ${error.message}`, 'error');
    }
});

document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        await Amplify.Auth.signOut();
        setStatusMessage(authStatus, 'Logged out successfully.', 'info');
        authSection.classList.remove('hidden');
        advisorSection.classList.add('hidden');
        // Clear any previous status/output
        uploadStatus.innerText = '';
        adviceOutput.innerText = 'Your tax advice will appear here after processing.';
        adviceOutput.classList.add('info');
        adviceOutput.classList.remove('success', 'error');
    } catch (error) {
        console.error('Error signing out: ', error);
        setStatusMessage(authStatus, `Logout error: ${error.message}`, 'error');
    }
});

// --- File Upload Logic ---
document.getElementById('upload-btn').addEventListener('click', async () => {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];
    if (!file) {
        setStatusMessage(uploadStatus, 'Please select a file to upload.', 'error');
        return;
    }
    
    setStatusMessage(uploadStatus, `Uploading "${file.name}"... This may take a moment.`, 'info');
    try {
        // Amplify Storage.put automatically handles S3 uploads.
        // 'level: private' ensures the file is accessible only by the user who uploaded it.
        await Amplify.Storage.put(file.name, file, {
            level: 'private',
            contentType: file.type // Set content type for proper S3 handling
        });
        setStatusMessage(uploadStatus, `File "${file.name}" uploaded successfully! Processing initiated.`, 'success');
        fileInput.value = ''; // Clear the file input
    } catch (error) {
        setStatusMessage(uploadStatus, `Upload error: ${error.message}`, 'error');
    }
});

// --- Get Tax Advice Logic (Calls your Lambda via API Gateway) ---
document.getElementById('get-advice-btn').addEventListener('click', async () => {
    setStatusMessage(adviceOutput, 'Generating tax advice... This might take a while as AI processes your data.', 'info');
    
    const apiName = 'TaxAdvisorAPI'; // Matches the 'name' in Amplify.configure API endpoint
    const path = '/advice'; // Matches the resource path in API Gateway
    
    try {
        // Get the current authenticated user's ID to send to the Lambda function
        const currentUser = await Amplify.Auth.currentAuthenticatedUser();
        const userId = currentUser.username; // Cognito username is typically the email or a unique ID

        const requestBody = {
            userId: userId,
            // You might want to send more context here, e.g., the name of the last uploaded document
            // For now, the Lambda will fetch all data for the userId from DynamoDB
        };

        const response = await Amplify.API.post(apiName, path, {
            body: requestBody,
            headers: {
                // Amplify automatically adds authorization headers for authenticated users
                // if your API Gateway is configured with Cognito Authorizer or IAM authorization.
                // For Lambda Proxy, it's often passed through.
            }
        });
        
        // Assuming your Lambda returns a JSON with a 'tax_advice' key
        if (response && response.tax_advice) {
            setStatusMessage(adviceOutput, response.tax_advice, 'success');
        } else {
            setStatusMessage(adviceOutput, 'Received an unexpected response from the AI advisor.', 'error');
        }
    } catch (error) {
        console.error('Error getting advice:', error);
        setStatusMessage(adviceOutput, `Error generating advice: ${error.message}. Please ensure documents are uploaded and try again.`, 'error');
    }
});

// --- Initial Session Check on Page Load ---
async function checkSession() {
    try {
        // Attempt to get the current authenticated user session
        await Amplify.Auth.currentSession();
        // If successful, hide auth section and show advisor section
        authSection.classList.add('hidden');
        advisorSection.classList.remove('hidden');
        setStatusMessage(authStatus, 'You are logged in.', 'success');
    } catch (error) {
        // If no session, user is not logged in, show auth section
        authSection.classList.remove('hidden');
        advisorSection.classList.add('hidden');
        setStatusMessage(authStatus, 'Please sign up or log in to continue.', 'info');
    }
}

// Run the session check when the page loads
checkSession();