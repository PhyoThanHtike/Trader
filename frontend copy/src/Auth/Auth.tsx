import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type authMode = "login" | "signup";

interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData extends LoginFormData {
  username: string;
  email: string;
  password: string;
}

const Auth = () => {
  const [mode, setMode] = useState<authMode>("login");
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [signUpData, setSignUpData] = useState<SignupFormData>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (mode == "login") {
      setLoginData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setSignUpData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        console.log(loginData);
        navigate('/home');
      } else {
        console.log(signUpData);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "login" ? "signup" : "login"));
    setError(null);
  };

  // Get current form data based on mode
  const currentFormData = mode === "login" ? loginData : signUpData;

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 h-[95vh] py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            {mode == "login" ? "Sign in to your account": "Create New Account"}
            
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" onSubmit={handleSubmit} method="POST" className="space-y-6">
            {mode == "signup" && (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="username"
                    required
                    value={signUpData.username}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-600 sm:text-sm/6"
                  />
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={currentFormData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={currentFormData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-neutral-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          {mode == "login" ? (
            <>
              <p className="mt-10 text-center text-sm/6 text-gray-500">
                Not a member?{" "}
                <button
                  onClick={toggleMode}
                  className="font-semibold hover:cursor-pointer text-indigo-600 hover:text-indigo-500"
                >
                  Join Now!
                </button>
              </p>
            </>
          ) : (
            <>
              <p className="mt-10 text-center text-sm/6 text-gray-500">
                Already have an Account?{" "}
                <button
                  onClick={toggleMode}
                  className="font-semibold hover:cursor-pointer text-indigo-600 hover:text-indigo-500"
                >
                  Sign In
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Auth;
