"use client";
import React, { useCallback, useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cookie from "js-cookie";
import Cookies from "js-cookie";

export default function Home() {
  const { data: session } = useSession();

  // const [copiedUrl, setCopiedUrl] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [imgurl, setImgUrl] = useState(null);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [copied, setCopied] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [data, setData] = useState(null);

  // const handleCopy = (shortUrl) => {
  //   navigator.clipboard.writeText(shortUrl);
  //   setCopiedUrl(shortUrl);
  //   setTimeout(() => setCopiedUrl(''), 2000); // Reset copied URL after 2 seconds
  // };

  const openDeletePopup = useCallback(() => {
    setDeletePopup((prevState) => !prevState);
  }, []);

  const openDropdown = useCallback(() => {
    setDropdown((prevState) => !prevState);
  }, []);

  const logout = async () => {
    Cookies.remove("cookie-1");
    router.push("/");
  };

  const toggleCopy = () => {
    const copyButton = document.getElementById("default-message");
    const copiedButton = document.getElementById("success-message");
    copyButton.classList.add("hidden");
    copiedButton.classList.remove("hidden");
    setCopied(true);
    setTimeout(() => {
      copyButton.classList.remove("hidden");
      copiedButton.classList.add("hidden");
      setCopied(false);
    }, 3000);
  };

  const getUrls = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8010/geturl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        console.log("Fetching failed");
      } else {
        const Data = await response.json();
        setData(Data);
        console.log(data);
      }
    } catch {
      console.log("Fetching failed, server error");
    }
  }, [email]);

  const getDetails = useCallback(async () => {
    try {
      const token = cookie.get("cookie-1");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/decode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        }
      );
      if (!response.ok) {
        console.error("Cannot get avatar");
      } else {
        const data = await response.json();
        setImgUrl(data.username.avatar);
        setEmail(data.username.email);
        setName(data.username.username);
      }
    } catch (error) {
      console.error("Server", error);
    }
  }, []);

  const data = [
    {
      originalUrl: "https://example.com/very-long-url-that-needs-shortening",
      shortUrl: "https://short.url/abc123",
      created: "2024-03-16",
    },
    {
      originalUrl: "https://another-example.com/another-long-url",
      shortUrl: "https://short.url/def456",
      created: "2024-03-15",
    },
    {
      originalUrl: "https://another-example.com/another-long-url",
      shortUrl: "https://short.url/def456",
      created: "2024-03-15",
    },
  ];
  useEffect(() => {
    if (session && session.user && session.user.image) {
      setEmail(session.user.email);
      setImgUrl(session.user.image);
      setName(session.user.name);
    }
  }, [session]);

  useEffect(() => {
    getDetails();
    getUrls();
  }, [getDetails, getUrls]);

  useEffect(() => {
    console.log("Page rerendering...", data);
  }, [data]);

  return (
    <>
      <ToastContainer />
      <NextTopLoader />
      <nav className="bg-white border-gray-200 dark:bg-gray-900 relative">
        {" "}
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://99designs-blog.imgix.net/blog/wp-content/uploads/2022/05/Mastercard_2019_logo.svg-e1659036851269.png?auto=format&q=60&fit=max&w=930"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              URL Shortner
            </span>
          </a>
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
            {" "}
            <button
              type="button"
              className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
              onClick={openDropdown}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src={imgurl}
                alt="https://e7.pngegg.com/pngimages/136/22/png-clipart-user-profile-computer-icons-girl-customer-avatar-angle-heroes.png"
              />
            </button>
            {/* Dropdown menu */}
            {dropdown && (
              <div
                className="absolute z-10   top-full right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                id="user-dropdown"
              >
                {" "}
                {/* Adjust top value */}
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">
                    {name}
                  </span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                    {email}
                  </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <li>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => signOut() && logout()}
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Sign out
                    </a>
                  </li>
                </ul>
              </div>
            )}
            {/* Mobile menu button */}
            <button
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-user"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          {/* Main menu */}
          <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-user"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <a
                  href="/"
                  className="block py-2 px-3 mr-7 text-white  rounded md:bg-transparent md:p-0 md:hover:text-blue-700"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/stats"
                  className="block py-2 px-3 mr-7 rounded hover:bg-gray-100 md:hover:bg-transparent text-blue-500  md:p-0 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Stats
                </a>
              </li>
              <li>
                <a
                  href="/stats"
                  className="block py-2 px-3 mr-7 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/stats"
                  className="block py-2 px-3 mr-7 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {deletePopup && (
        <div class="fixed inset-0 p-4  flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]">
          <div class="w-full max-w-md shadow-lg rounded-md p-6 dark:bg-gray-700 relative">
            <svg
              onClick={openDeletePopup}
              xmlns="http://www.w3.org/2000/svg"
              class="w-3.5 cursor-pointer shrink-0 fill-black hover:fill-red-500 float-right"
              viewBox="0 0 320.591 320.591"
            >
              <path
                d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                data-original="#000000"
              ></path>
              <path
                d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                data-original="#000000"
              ></path>
            </svg>
            <div class="my-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-16 fill-red-500 inline"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                  data-original="#000000"
                />
                <path
                  d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                  data-original="#000000"
                />
              </svg>
              <h4 className="text-xl font-semibold mt-6">
                Are you sure you want to delete it?
              </h4>
              <p className="text-sm text-slate-400 mt-4">
                Are you sure want to delete it ? These process is not reversible
              </p>
            </div>
            <div class="flex flex-col space-y-2">
              <button
                type="button"
                className="px-6 py-2.5 rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500"
              >
                Delete
              </button>
              <button
                onClick={openDeletePopup}
                type="button"
                className="px-6 py-2.5 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative m-5 overflow-x-auto shadow-md sm:rounded-lg mt-10">
        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
          <div>
            <button
              id="dropdownRadioButton"
              data-dropdown-toggle="dropdownRadio"
              className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              type="button"
            >
              <svg
                className="w-3 h-3 text-gray-500 dark:text-gray-400 me-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                Original URL
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider"
              >
                Short URL
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider"
              >
                Created
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-md font-bold text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className=" bg-gray-500 divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.originalUrl}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.shortUrl}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.created}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2">
                    Copy
                  </button>
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>




      <footer className="bg-white rounded-lg mt-96 shadow dark:bg-gray-900 ">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a
              href="https://flowbite.com/"
              className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
            >
              <img
                src="https://99designs-blog.imgix.net/blog/wp-content/uploads/2022/05/Mastercard_2019_logo.svg-e1659036851269.png?auto=format&q=60&fit=max&w=930  "
                className="h-8"
                alt="Flowbite Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                URL Shortener
              </span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Licensing
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2024{" "}
            <a href="https://flowbite.com/" className="hover:underline"></a>.
            All Rights Reserved.
          </span>
        </div>
      </footer>
    </>
  );
}