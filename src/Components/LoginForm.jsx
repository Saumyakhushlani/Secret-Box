"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

const Form = () => {
  const router = useRouter();
  const [isLoginForm, setLoginForm] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  let { data: session } = useSession();
  // console.log(session)
  useEffect(() => {
    const checkSession = async () => {
      console.log("trying to login with Google");
      // console.log("Session data: ", session);
      if (session?.user.email) {
        try {
          const response = await axios.post("/api/user/login", {
            email: session.user.email,
            withGoogle: true,
          });
          toast.success("Login Successfully");
          // console.log("Login successful ", response.data);
          router.push("/home");
        } catch (error) {
          if (error.response) {
            const status = error.response.status;
            if (status === 401) {
              toast.error("Invalid login credentials");
            } else if (status === 404) {
              toast("User not found", {
                icon: "❗",
              });
            } else if (status === 403) {
              toast("Email and password required", {
                icon: "❗",
              });
            } else {
              toast.error("Something went wrong");
            }
          } else if (error.request) {
            toast.error("Network error. Please check your connection.");
          } else {
            toast.error("Something went wrong");
          }
        }
      }
    }

    checkSession();
  }, [session])
  // console.log(session)

  const SignWithGoogle = async () => {
    signIn('google')
    console.log("Signing in with Google...");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (!isLoginForm) {
      try {
        const response = await axios.post("/api/user/signup", formData);
        toast.success("Signup Successfully");
        // console.log("Signup successfull", response.data);
        router.push("/home");
      } catch (error) {
        if (error.response) {
          const status = error.response.status;
          if (status === 400 || status === 422) {
            toast("Email and password required", {
              icon: "❗",
            });
          } else if (status === 401 || status === 409) {
            toast("User already exists", {
              icon: "❗",
            });
          } else {
            toast.error("Something went wrong");
          }
        } else if (error.request) {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error("Something went wrong");
        }
      }
    } else {
      try {
        const response = await axios.post("/api/user/login", formData);
        toast.success("Login Successfully");
        // console.log("Login succesful ", response.data);
        router.push("/home");
      } catch (error) {
        if (error.status === 401) {
          toast.error("Invalid login credentials");
        } else if (error.status === 404) {
          toast("User not found", {
            icon: "❗",
          });
        } else if (error.status === 403) {
          toast("Email and password required", {
            icon: "❗",
          });
        } else {
          toast.error("Something went wrong");
        }
        console.log("Failed to send data", error.message);
      }
    }
  };

  return (
    <StyledWrapper>
      <Toaster />
      <div className="card shadow-[0_0_15px_rgba(0,0,0,0.4)] overflow-x-hidden">
        <div className="form">
          <div className="title text-center">
            {isLoginForm ? "Login" : "Signup"}
          </div>
          <label className="label_input" htmlFor="email-input">
            Email
          </label>
          <input
            spellCheck="false"
            className="input"
            type="email"
            name="email"
            id="email-input"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="a@gmail.com"
          />
          <div className="frg_pss">
            <label className="label_input" htmlFor="password-input">
              Password
            </label>
          </div>
          <input
            spellCheck="false"
            className="input"
            type="password"
            name="password"
            id="password-input"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="password"
          />
          <button
            className="submit bg-[#4212de]"
            type="button"
            onClick={handleSubmit}
          >
            Submit
          </button>

          <button
            className=" w-full flex items-center justify-center gap-3 px-5 py-2 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:shadow-md transition-all duration-200 font-medium my-3"
            onClick={SignWithGoogle}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="text-lg">
            {isLoginForm ? "Dont't have an account." : "Already have account. "}{" "}
            <span
              onClick={() => setLoginForm(!isLoginForm)}
              className="text-blue-700 underline"
            >
              {isLoginForm ? "Signup" : "Login"}
            </span>
          </div>
        </div>

        <label className="avatar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={35}
            height={35}
            viewBox="0 0 64 64"
            id="monkey"
          >
            <ellipse cx="53.7" cy={33} rx="8.3" ry="8.2" fill="#89664c" />
            <ellipse cx="53.7" cy={33} rx="5.4" ry="5.4" fill="#ffc5d3" />
            <ellipse cx="10.2" cy={33} rx="8.2" ry="8.2" fill="#89664c" />
            <ellipse cx="10.2" cy={33} rx="5.4" ry="5.4" fill="#ffc5d3" />
            <g fill="#89664c">
              <path d="m43.4 10.8c1.1-.6 1.9-.9 1.9-.9-3.2-1.1-6-1.8-8.5-2.1 1.3-1 2.1-1.3 2.1-1.3-20.4-2.9-30.1 9-30.1 19.5h46.4c-.7-7.4-4.8-12.4-11.8-15.2" />
              <path d="m55.3 27.6c0-9.7-10.4-17.6-23.3-17.6s-23.3 7.9-23.3 17.6c0 2.3.6 4.4 1.6 6.4-1 2-1.6 4.2-1.6 6.4 0 9.7 10.4 17.6 23.3 17.6s23.3-7.9 23.3-17.6c0-2.3-.6-4.4-1.6-6.4 1-2 1.6-4.2 1.6-6.4" />
            </g>
            <path
              d="m52 28.2c0-16.9-20-6.1-20-6.1s-20-10.8-20 6.1c0 4.7 2.9 9 7.5 11.7-1.3 1.7-2.1 3.6-2.1 5.7 0 6.1 6.6 11 14.7 11s14.7-4.9 14.7-11c0-2.1-.8-4-2.1-5.7 4.4-2.7 7.3-7 7.3-11.7"
              fill="#e0ac7e"
            />
            <g fill="#3b302a" className="monkey-eye-nose">
              <path d="m35.1 38.7c0 1.1-.4 2.1-1 2.1-.6 0-1-.9-1-2.1 0-1.1.4-2.1 1-2.1.6.1 1 1 1 2.1" />
              <path d="m30.9 38.7c0 1.1-.4 2.1-1 2.1-.6 0-1-.9-1-2.1 0-1.1.4-2.1 1-2.1.5.1 1 1 1 2.1" />
              <ellipse
                cx="40.7"
                cy="31.7"
                rx="3.5"
                ry="4.5"
                className="monkey-eye-r"
              />
              <ellipse
                cx="23.3"
                cy="31.7"
                rx="3.5"
                ry="4.5"
                className="monkey-eye-l"
              />
            </g>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={35}
            height={35}
            viewBox="0 0 64 64"
            id="monkey-hands"
          >
            <path
              fill="#89664C"
              d="M9.4,32.5L2.1,61.9H14c-1.6-7.7,4-21,4-21L9.4,32.5z"
            />
            <path
              fill="#FFD6BB"
              d="M15.8,24.8c0,0,4.9-4.5,9.5-3.9c2.3,0.3-7.1,7.6-7.1,7.6s9.7-8.2,11.7-5.6c1.8,2.3-8.9,9.8-8.9,9.8
      	s10-8.1,9.6-4.6c-0.3,3.8-7.9,12.8-12.5,13.8C11.5,43.2,6.3,39,9.8,24.4C11.6,17,13.3,25.2,15.8,24.8"
            />
            <path
              fill="#89664C"
              d="M54.8,32.5l7.3,29.4H50.2c1.6-7.7-4-21-4-21L54.8,32.5z"
            />
            <path
              fill="#FFD6BB"
              d="M48.4,24.8c0,0-4.9-4.5-9.5-3.9c-2.3,0.3,7.1,7.6,7.1,7.6s-9.7-8.2-11.7-5.6c-1.8,2.3,8.9,9.8,8.9,9.8
      	s-10-8.1-9.7-4.6c0.4,3.8,8,12.8,12.6,13.8c6.6,1.3,11.8-2.9,8.3-17.5C52.6,17,50.9,25.2,48.4,24.8"
            />
          </svg>
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    --p: 32px;
    --h-form: auto;
    --w-form: 380px;
    --input-px: 0.75rem;
    --input-py: 0.65rem;
    --submit-h: 38px;
    --space-y: 0.5rem;
    width: var(--w-form);
    height: var(--h-form);
    max-width: 100%;
    border-radius: 16px;
    background: white;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    overflow-y: auto;
    padding: var(--p);
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    -webkit-font-smoothing: antialiased;
    -webkit-user-select: none;
    user-select: none;
    font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
      "Lucida Sans", Arial, sans-serif;
  }

  .avatar {
    --sz-avatar: 166px;
    order: 0;
    width: var(--sz-avatar);
    min-width: var(--sz-avatar);
    max-width: var(--sz-avatar);
    height: var(--sz-avatar);
    min-height: var(--sz-avatar);
    max-height: var(--sz-avatar);
    border: 1px solid #707070;
    border-radius: 9999px;
    overflow: hidden;
    cursor: pointer;
    z-index: 2;
    perspective: 80px;
    position: relative;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    --sz-svg: calc(var(--sz-avatar) - 10px);
  }
  .avatar svg {
    position: absolute;
    transition: transform 0.2s ease-in, opacity 0.1s;
    transform-origin: 50% 100%;
    height: var(--sz-svg);
    width: var(--sz-svg);
    pointer-events: none;
  }
  .avatar svg#monkey {
    z-index: 1;
  }
  .avatar svg#monkey-hands {
    z-index: 2;
    transform-style: preserve-3d;
    transform: translateY(calc(var(--sz-avatar) / 1.25)) rotateX(-21deg);
  }

  .avatar::before {
    content: "";
    border-radius: 45%;
    width: calc(var(--sz-svg) / 3.889);
    height: calc(var(--sz-svg) / 5.833);
    border: 0;
    border-bottom: calc(var(--sz-svg) * (4 / 100)) solid #3c302a;
    bottom: 20%;
    position: absolute;
    transition: all 0.2s ease;
    z-index: 3;
  }

  .avatar svg#monkey .monkey-eye-r,
  .avatar svg#monkey .monkey-eye-l {
    animation: blink 10s 1s infinite;
    transition: all 0.2s ease;
  }

  @keyframes blink {
    0%,
    2%,
    4%,
    26%,
    28%,
    71%,
    73%,
    100% {
      ry: 4.5;
      cy: 31.7;
    }
    1%,
    3%,
    27%,
    72% {
      ry: 0.5;
      cy: 30;
    }
  }

  /* Monkey closes eyes when password field is focused */
  .form:has(#password-input:focus) ~ .avatar svg#monkey .monkey-eye-r,
  .form:has(#password-input:focus) ~ .avatar svg#monkey .monkey-eye-l {
    ry: 0.5;
    cy: 30;
    animation: none;
  }

  .form:has(#password-input:focus) ~ .avatar svg#monkey-hands {
    transform: translate3d(0, 0, 0) rotateX(0deg);
  }

  .avatar svg#monkey,
  .avatar::before,
  .avatar svg#monkey .monkey-eye-nose,
  .avatar svg#monkey .monkey-eye-r,
  .avatar svg#monkey .monkey-eye-l {
    transition: all 0.2s ease;
  }

  .form:focus-within ~ .avatar svg#monkey {
    animation: slick 3s ease infinite 1s;
    --center: rotateY(0deg);
    --left: rotateY(-4deg);
    --right: rotateY(4deg);
  }

  .form:focus-within ~ .avatar::before,
  .form:focus-within ~ .avatar svg#monkey .monkey-eye-nose {
    ry: 3;
    cy: 35;
    animation: slick 3s ease infinite 1s;
    --center: translateX(0);
    --left: translateX(-0.5px);
    --right: translateX(0.5px);
  }

  /* Only apply eye movement animation when NOT focusing on password */
  .form:focus-within ~ .avatar svg#monkey .monkey-eye-r,
  .form:focus-within ~ .avatar svg#monkey .monkey-eye-l {
    ry: 3;
    cy: 35;
    animation: slick 3s ease infinite 1s;
    --center: translateX(0);
    --left: translateX(-0.5px);
    --right: translateX(0.5px);
  }

  /* Override to keep eyes closed when password is focused */
  .form:has(#password-input:focus) ~ .avatar svg#monkey .monkey-eye-r,
  .form:has(#password-input:focus) ~ .avatar svg#monkey .monkey-eye-l {
    ry: 0.5;
    cy: 30;
    animation: none;
  }

  @keyframes slick {
    0%,
    100% {
      transform: var(--center);
    }
    25% {
      transform: var(--left);
    }
    75% {
      transform: var(--right);
    }
  }

  .form {
    order: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    width: 100%;
  }

  .form .title {
    width: 100%;
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 1rem;
    padding-top: 0;
    padding-bottom: 1rem;
    color: rgba(0, 0, 0, 0.7);
    border-bottom: 2px solid rgba(0, 0, 0, 0.3);
  }

  .form .label_input {
    white-space: nowrap;
    font-size: 1rem;
    margin-top: calc(var(--space-y) / 2);
    color: rgba(0, 0, 0, 0.9);
    font-weight: 600;
    display: inline;
    text-align: left;
    margin-right: auto;
    position: relative;
    z-index: 99;
    -webkit-user-select: none;
    user-select: none;
  }

  .form .input {
    resize: vertical;
    background: white;
    border: 1px solid #8f8f8f;
    border-radius: 6px;
    outline: none;
    padding: var(--input-py) var(--input-px);
    font-size: 18px;
    width: 100%;
    color: #000000b3;
    margin: var(--space-y) 0;
    transition: all 0.25s ease;
  }

  .form .input:focus {
    border: 1px solid #4212de;
    outline: 0;
    box-shadow: 0 0 0 2px #4212de;
  }

  .form .frg_pss {
    width: 100%;
    display: inline-flex;
    align-items: center;
  }

  .form .frg_pss a {
    background-color: transparent;
    cursor: pointer;
    text-decoration: underline;
    transition: color 0.25s ease;
    color: #000000b3;
    font-weight: 500;
    float: right;
  }

  .form .frg_pss a:hover {
    color: #000;
  }

  .form .submit {
    height: var(--submit-h);
    width: 100%;
    outline: none;
    cursor: pointer;
    background-color: #4212de;
    background-image: linear-gradient(
      -180deg,
      rgba(255, 255, 255, 0.09) 0%,
      rgba(17, 17, 17, 0.04) 100%
    );
    border: 1px solid rgba(22, 22, 22, 0.2);
    font-weight: 500;
    letter-spacing: 0.25px;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1rem;
    text-align: center;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    -webkit-appearance: button;
    appearance: button;
    margin: var(--space-y) 0 0;
  }

  .form .submit:hover {
    background-image: linear-gradient(
      -180deg,
      rgba(255, 255, 255, 0.18) 0%,
      rgba(17, 17, 17, 0.08) 100%
    );
    border: 1px solid rgba(22, 22, 22, 0.2);
    color: #fff;
  }
`;

export default Form;
