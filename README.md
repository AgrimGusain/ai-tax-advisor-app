# AI Tax Advisor 💰

This is a web application that serves as a personal AI-powered tax advisor. Users can sign up, log in, and receive personalized tax advice. The application is built with React and leverages AWS Amplify for authentication and backend services.

---

## 🚀 Live Demo

You can access the live, deployed version of the application here:

**[https://main.d2fenvrgt56xmz.amplifyapp.com/](https://main.d2fenvrgt56xmz.amplifyapp.com/)**

---

## 🛠️ Tech Stack

-   **Frontend:** [React](https://reactjs.org/) (with Vite)
-   **UI Components:** [@aws-amplify/ui-react](https://ui.docs.amplify.aws/)
-   **Backend & Authentication:** [AWS Amplify Gen 2](https://docs.amplify.aws/gen2/)
-   **Hosting:** [AWS Amplify Hosting](https://aws.amazon.com/amplify/hosting/)

---

## ⚙️ Running the Project Locally

To run this project on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd ai-tax-advisor-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your backend sandbox:**
    You will need to have your own AWS account configured. Run the Amplify sandbox  to deploy a local version of the backend.
    ```bash
    npx ampx sandbox
    ```
    This will generate an `amplify_outputs.json` file.

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173`.
