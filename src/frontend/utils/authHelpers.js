const SignUpTitle = "Start Your Next Journey";
const SignUpSubtitle = "Sign up to unlock a smarter way to travel together. Plan, share, and vote trips that everyone will love.";

const SignInTitle = "Pick Up Where Left Off";
const SignInSubtitle = "Login to access your personalized travel plans, join group trips, and see what's next on your itinerary.";

const ForgotPasswordTitle = "Forgot Your Password?";
const ForgotPasswordSubtitle = "No worries—let’s get you back on your journey.";

export const setTitle = (type) => {
    if (type === "signup") {
        return SignUpTitle;
    } else if (type === "signin") {
        return SignInTitle;
    } else if (type === "forgotpassword") {
        return ForgotPasswordTitle;
    }
}

export const setSubTitle = (type) => {
    if (type === "signup") {
        return SignUpSubtitle;
    } else if (type === "signin") {
        return SignInSubtitle;
    } else if (type === "forgotpassword") {
        return ForgotPasswordSubtitle;
    }
}

export const setButtonText = (type) => {
    if (type === "signup") {
        return "Create Account";
    } else if (type === "signin") {
        return "Login";
    } else if (type === "forgotpassword") {
        return "Send Reset Link";
    }
}