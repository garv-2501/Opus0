import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"; // Using dracula theme as base
import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { MessageContext } from "../contexts/MessageContext";

// SVG for AI icon
// SVG for AI icon with white fill
const AiIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.0"
    viewBox="0 0 1500 1500"
    className="w-10 h-10 mt-2"
    fill="white"
  >
    <g transform="scale(0.5)">
      <path
        d="M1325 2791 c-249 -61 -388 -253 -446 -616 -17 -101 -16 -489 0 -605
      50 -358 195 -561 446 -625 77 -20 260 -19 344 0 245 58 390 246 448 580 21
      124 24 533 5 667 -51 356 -197 548 -457 603 -94 20 -252 18 -340 -4z m252
      -137 c87 -66 135 -250 155 -586 9 -161 9 -249 0 -390 -23 -366 -82 -557 -185
      -611 -34 -17 -43 -18 -79 -8 -115 35 -177 212 -199 567 -12 191 -7 523 11 664
      22 174 70 301 135 358 47 42 112 45 162 6z"
      />
      <path d="M820 655 l0 -145 680 0 680 0 0 145 0 145 -680 0 -680 0 0 -145z" />
    </g>
  </svg>
);

// Custom styles for code blocks
const customStyle = {
  ...dracula,
  'code[class*="language-"]': {
    ...dracula['code[class*="language-"]'],
    backgroundColor: "#1d1f21",
    color: "#cddbf7",
  },
  'pre[class*="language-"]': {
    ...dracula['pre[class*="language-"]'],
    backgroundColor: "#1d1f21",
    color: "#cddbf7",
    margin: "0px", // Remove any margin
    padding: "0px", // Remove padding
  },
  'pre[class*="language-"]::-webkit-scrollbar': {
    backgroundColor: "#1d1f21",
    height: "48px",
    width: "48px",
  },
  'pre[class*="language-"]::-webkit-scrollbar-thumb': {
    backgroundColor: "#3b82f6",
  },
};

// Copy button component with SVG icons and feedback
// eslint-disable-next-line react/prop-types
const CopyButton = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000); // Revert back after 2 seconds
  };

  return (
    <button
      onClick={handleCopy}
      className="flex gap-1 items-center text-text-color hover:text-text-color text-sm ml-auto"
    >
      {copied ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
            />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
            />
          </svg>
          Copy Code
        </>
      )}
    </button>
  );
};

// Custom renderers for Markdown elements
const renderers = {
  h1: (props) => <h1 className="mb-6" {...props} />, // 36px via global CSS
  h2: (props) => <h2 className="mb-5" {...props} />, // 30px via global CSS
  h3: (props) => <h3 className="mb-4" {...props} />, // 24px via global CSS
  p: (props) => <p className="my-6" {...props} />, // Inherits from global styles
  strong: (props) => <strong {...props} />, // Bold styling from global CSS
  em: (props) => <em {...props} />, // Italic styling from global CSS
  blockquote: (props) => <blockquote className="my-8" {...props} />, // Blockquote styling applied globally
  code: ({ inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <div className=" font-mono rounded-md border-[0.5px] border-gray-700 bg-gray-800 my-4">
        {/* Code Header with Language and Copy Button */}
        <div className="flex items-center justify-between bg-gray-700 px-4 py-2 text-xs text-text-color rounded-t-md">
          {match[1]}
          <CopyButton code={String(children)} />
        </div>

        {/* Code Block */}
        <div className="p-4 overflow-x-auto bg-[#1d1f21]">
          <SyntaxHighlighter
            style={customStyle}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      </div>
    ) : (
      <code className="rounded-md p-1 text-sm" {...props}>
        {children}
      </code>
    );
  },
  ul: (props) => <ul className="list-disc list-inside my-6" {...props} />, // Unordered list
  ol: (props) => <ol className="list-decimal list-inside my-6" {...props} />, // Ordered list
  table: (props) => (
    <table
      className="table-auto border-collapse w-full my-8 rounded-2xl"
      {...props}
    />
  ),
  th: (props) => (
    <th className="border px-6 py-3 font-bold bg-gray-700" {...props} />
  ), // Table header
  td: (props) => <td className="border px-6 py-3" {...props} />, // Table cell
  sup: (props) => <sup className="text-sm" {...props} />, // Superscript
  sub: (props) => <sub className="text-sm" {...props} />, // Subscript
  a: (props) => (
    <a className="text-blue-500 underline hover:text-blue-400" {...props} />
  ), // Links
  footnoteReference: ({ identifier }) => (
    <sup className="footnote-ref">{identifier}</sup>
  ),
  footnoteDefinition: ({ identifier, children }) => (
    <div className="footnote" id={`footnote-${identifier}`}>
      <p className="text-sm">
        {identifier}: {children}
      </p>
    </div>
  ),
  taskList: (props) => <ul className="list-none pl-0" {...props} />, // Task list
  taskItem: ({ checked, children }) => (
    <li
      className={`flex items-center space-x-2 ${
        checked ? "completed-task" : ""
      }`}
    >
      <input type="checkbox" checked={checked} readOnly className="mr-2" />
      <span>{children}</span>
    </li>
  ),
};

const ChatArea = () => {
  const { chatHistory } = useContext(MessageContext);

  return (
    <>
      <div className=" chat-area flex-1 bg-main-area-color p-4 rounded overflow-y-auto">
        {/* Wrapper div to control max width and center content for user messages */}
        <div className="w-full max-w-[900px] mx-auto">
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`mb-4 ${
                chat.role === "user" ? "text-right" : "text-left"
              }`}
            >
              {/* User Messages will remain in a box with constraints */}
              {chat.role === "user" ? (
                <div
                  className="inline-block p-3 bg-user-message-color text-text-color self-end text-left rounded-3xl"
                  style={{
                    whiteSpace: "pre-wrap",
                    maxWidth: "75%",
                    wordBreak: "break-word",
                  }}
                >
                  {chat.content}
                </div>
              ) : (
                // AI Messages with a simple fade-in effect
                <div className="flex items-start">
                  {/* AI Icon */}
                  <div className="mt-6">
                    <AiIcon />
                  </div>

                  {/* Apply fade-in and blur-out animation for AI message */}
                  <motion.div
                    className="p-3 text-text-color"
                    initial={{ opacity: 0, filter: "blur(5px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 0.3 }}
                    style={{
                      whiteSpace: "normal",
                      maxWidth: "95%",
                      wordBreak: "break-word",
                    }}
                  >
                    <ReactMarkdown
                      components={renderers}
                      remarkPlugins={[remarkGfm]}
                    >
                      {chat.content}
                    </ReactMarkdown>
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatArea;
