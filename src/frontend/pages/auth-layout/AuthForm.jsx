import React, {useState, useEffect} from "react";
import UnsplashComponent from "../../components/custom/unsplash.jsx";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';
import { signInWithGoogle, signInWithApple, signInWithEmail } from "../../../backend/firebase.js";
import {useNavigate} from "react-router-dom";
import { setTitle, setSubTitle, setButtonText} from "../../utils/authHelpers.js";


export default function AuthForm({type = "signup"}) {
    const [showPassword, setShowPassword] = useState(false);
    const [userEmail, setUserEmail] = useState(() => localStorage.getItem("userEmail") || "");
    const [password, setPassword] = useState('');
    const logoURL = "https://firebasestorage.googleapis.com/v0/b/travel-mate-sm07.firebasestorage.app/o/travel-mate-logo.svg?alt=media&token=43abb583-1320-4935-934d-a51d8f94f179";

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("userEmail", userEmail);
    }, [userEmail]);

    return (
        <>
            <div className={"min-h-screen mx-auto"}>
                <div className="px-4 py-4">
                    {/* GRID: form + (xl) photo */}
                    <div className="grid grid-flow-row grid-cols-1 xl:grid-cols-12 gap-6">
                        {/* LEFT: form (7/12 on xl) */}
                        <div className={"xl:col-span-8 flex flex-col items-center"}>
                            <div className={"flex flex-col justify-center items-center min-w-full min-h-[90vh]"}>
                                <div className={"flex flex-col gap-6 items-start max-w-md lg:w-[500px]"}>
                                    {/* Logo Placeholder */}
                                    <div className="mb-2">
                                        <div className="relative rounded-full">
                                            <img src={logoURL} className={"h-10 w-10"} />
                                        </div>
                                    </div>

                                    {/* Header Text*/}
                                    <div className={"flex flex-col gap-2"}>
                                        <h1 className={"font-normal text-xl"}>{setTitle(type)}</h1>
                                        <p className={"font-light text-sm text-text-secondary "}>{setSubTitle(type)}</p>
                                    </div>

                                    {/* Signup Form */}
                                    <form className={"space-y-6 w-full"} onSubmit={async (e) => {
                                        e.preventDefault();

                                        try {
                                            if (type === "signin") {
                                                await signInWithEmail(userEmail, password);
                                                console.log("Navigating to /")
                                                navigate("/")
                                            } else {
                                                console.log("Sign Up!!!")
                                            }
                                        } catch (error) {
                                            const errorCode = error.code;
                                            const errorMessage = error.message;
                                            console.error(errorCode, errorMessage);
                                        }
                                    }}>
                                        {/* Name */}
                                        <div className={`${type === "signup" ? "flex" : "hidden"} flex-col space-y-2`}>
                                            <label htmlFor={"name"} className={"text-sm"}>Name</label>
                                            <input id={"name"} name={"name"} type={"text"} autoComplete={"name"} placeholder={"Enter your name"} className={"text-sm font-light w-full p-2.5 rounded-lg ring-1 ring-muted focus:ring-2 focus:shadow-md focus:shadow-info/20 focus:inset-shadow-xs focus:inset-shadow-white/5 outline-none tracking-wide"} />
                                        </div>

                                        {/* Email */}
                                        <div className={"flex flex-col space-y-2"}>
                                            <label htmlFor={"email"} className={"text-sm"}>Email</label>
                                            <input id={"email"} name={"email"} type={"email"} autoComplete={"email"} placeholder={"Enter your email address"} value={userEmail} onChange={e => setUserEmail(e.target.value)} className={"text-sm font-light w-full p-2.5 rounded-lg ring-1 ring-muted focus:ring-2 focus:shadow-md focus:shadow-info/20 focus:inset-shadow-xs focus:inset-shadow-white/5 outline-none tracking-wide"} />
                                        </div>

                                        {/* Password */}
                                        <div className={`${type == "forgotpassword" ? "hidden" : "flex"} flex-col space-y-2`}>
                                            <label htmlFor={"password"} className={"text-sm"}>Password</label>
                                            <div className={"relative"}>
                                                <input id={"password"} name={"password"} type={showPassword ? "text" : "password"} autoComplete={"new-password"} placeholder={"Create a secure password"} className={"text-sm font-light w-full p-2.5 rounded-lg ring-1 ring-muted focus:ring-2 focus:shadow-md focus:shadow-info/20 focus:inset-shadow-xs focus:inset-shadow-white/5 outline-none tracking-wide"} onChange={(e) => setPassword(e.target.value)}/>
                                                <button type={"button"} aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(s => !s)} className={"absolute inset-y-0 right-0 grid w-10 place-items-center text-text-secondary hover:text-info transition duration-400 cursor-pointer"} >
                                                    {showPassword ? ( <VisibilityOffIcon style={{ fontSize: 20 }} /> ) : ( <VisibilityIcon style={{ fontSize: 20 }} /> )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Create Account Button */}
                                        <button type={"submit"} className={"w-full bg-primary p-2.5 rounded-full font-light text-sm mt-2 hover:bg-info transition duration-400 cursor-pointer"}>{setButtonText(type)}</button>

                                        {/* Remember Me & Forgot Password*/}
                                        <div className={`${type === "signin" ? "flex" : "hidden"} justify-end w-full items-center`}>
                                            <a href={"/resetPassword"} className={"text-sm text-text-secondary font-light hover:underline hover:text-warning cursor-pointer"}>Forgot Password?</a>
                                        </div>
                                    </form>

                                    {/* Divider */}
                                    <div className={`${type === "forgotpassword" ? "hidden" : "flex"} flex-row justify-center items-center w-full mt-4`}>
                                        <span className={"flex-1 border-t border-[1.5px] mask-l-from-0.5 border-muted"}></span>
                                        <div className={"px-4 font-light text-xs whitespace-nowrap"}>{type === "signup" ? "or Sign Up With" : "or Sign In With" }</div>
                                        <span className={"flex-1 border-t border-[1.5px] mask-r-from-0.5 border-muted"}></span>
                                    </div>

                                    {/* OAuth Options */}
                                    <div className={`${type === "forgotpassword" ? "hidden" : "flex"} flex-row justify-center items-center w-full mt-4 gap-4`}>
                                        {/* Google Auth */}
                                        <div className="flex-1 rounded-full bg-muted p-3 flex justify-center items-center gap-2 hover:bg-accent-hover transition duration-400 cursor-pointer" onClick={async () => {
                                            try {
                                                await signInWithGoogle();
                                                console.log("Navigating to /");
                                                navigate("/");
                                            } catch (error) {
                                                const errorCode = error.code;
                                                const errorMessage = error.message;
                                                console.error(errorCode, errorMessage);
                                            }
                                        }}>
                                            <GoogleIcon fontSize="small" style={{color: "white"}} />
                                            <span className={"text-[12px] lg:text-sm m-0 leading-none"}>Google</span>
                                        </div>

                                        {/* Apple Auth */}
                                        <div className="flex-1 rounded-full bg-muted p-3 flex justify-center items-center gap-2 hover:bg-accent-hover transition duration-400 cursor-pointer">
                                            <AppleIcon fontSize="small" style={{color: "white"}} />
                                            <span className={"text-[12px] lg:text-sm m-0 leading-none"}>Apple</span>
                                        </div>
                                    </div>

                                    {/* Login Route */}
                                    <div className={`${type === "forgotpassword" ? "hidden" : "flex"} flex-row justify-center items-center w-full gap-1`}>
                                        <p className={"text-[12px] lg:text-sm text-text-secondary font-light"}>{type === "signup" ? "Already have an account?" : "Don't have an account?"}</p>
                                        <a href={type === "signup" ? "/login" : "/"} className={"text-white/80 text-[12px] lg:text-sm hover:text-warning transition duration-400 cursor-pointer"}>{type === "signup" ? "Sign In" : "Sign Up"}</a>
                                    </div>

                                    <div className={`${type === "forgotpassword" ? "flex" : "hidden"} flex-col justify-center items-center w-full`}>
                                        <span className={"w-full border-t border-[1px] border-muted"}></span>
                                        <a href={"/login"} className={"flex px-4 py-4 font-light text-sm whitespace-nowrap text-text-secondary gap-2 hover:text-warning"}><span>&larr;</span> Back to Sign In</a>
                                    </div>
                                </div>
                            </div>

                            {/*/!* Legal *!/*/}
                            <div className="mt-8 mb-8 flex items-center justify-between text-[7px] sm:text-[8px] lg:text-[12px] text-text-secondary w-full">
                                <span>&copy; 2025 Trevelo Inc. All right reserved.</span>

                                <div className="flex space-x-1">
                                    <a href="/privacy" className="hover:text-warning">Privacy Policy</a>
                                    <span>·</span>
                                    <a href="/terms" className="hover:text-warning">Terms &amp; Conditions</a>
                                </div>
                            </div>
                        </div>
                        {/* RIGHT: Unsplash image (5/12 on xl) */}
                        <div className="xl:col-span-4 hidden xl:block">
                            <div className="h-[95vh] rounded-xl overflow-hidden ring-1 ring-muted/50 shadow-2xl">
                                <div className="h-full w-full">
                                    <UnsplashComponent/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}