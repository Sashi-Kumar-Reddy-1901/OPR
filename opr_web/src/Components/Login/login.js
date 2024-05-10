import { Link } from "react-router-dom";
import { useRef } from "react";
import Logo from "../../logo.svg";
import "./login.css";

function Login() {
  const email = useRef(null);
  const password = useRef(null);

  const handleButtonClick = () => {
    console.log(email.current.value);
    console.log(password.current.value);
  };
  return (
    <>
      <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
        {/* Header */}
        <header className="bg-gray-200 py-4">
          <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
            <img src={Logo} alt="1" className="header-image" />
            <img src={Logo} alt="2" className="header-image" />
            <img src={Logo} alt="3" className="header-image" />
            <img src={Logo} alt="4" className="header-image" />
            <img src={Logo} alt="5" className="header-image" />
          </div>
        </header>

        <div className="max-w-screen-xl m-0 sm:m-2 bg-white shadow sm:rounded-lg flex justify-center flex-1">
          <div className="lg:w-1/2 xl:w-6/12 p-6 sm:p-8">
            <div>
              <p className="text-xl font-serif font-semibold text-blue-500">
                Finakon
              </p>
            </div>
            <div className="mt-12 flex flex-col items-center">
              <h1 className="text-2xl xl:text-3xl font-extrabold">Login</h1>
              <div className="w-full flex-1 mt-8">
                {/* Email and Password Inputs */}
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="mx-auto max-w-xs">
                    <input
                      ref={email}
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="email"
                      placeholder="User Id / Email"
                    />
                    <input
                      ref={password}
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="password"
                      placeholder="Password"
                    />
                    {/* Sign Up Button */}
                    <Link to="/dashboard" className="block w-full">
                    <button
                      onClick={handleButtonClick}
                      className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      <svg
                        className="w-6 h-6 -ml-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <path d="M20 8v6M23 11h-6" />
                      </svg>
                      <span className="ml-3">
                        <Link to="/dashboard"> Login</Link>{" "}
                      </span>
                    </button>
                    </Link>

                    {/* Terms of Service and Privacy Policy */}
                    <p className="mt-6 text-xs text-gray-600 text-center">
                      I agree to abide by templatana's
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
              }}
            ></div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-200 text-gray-600 py-4">
          <div className="max-w-screen-xl mx-auto px-4">
            <p style={{ margin: "0" }}>Powered by Finakon</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Login;
