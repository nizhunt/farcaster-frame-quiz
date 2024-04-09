import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
// import { neynar } from "frog/hubs";
import { handle } from "frog/vercel";

import questionnaire from "../data/solidity.json" assert { type: "json" };

// Initialize the index for questions
var index = 0;

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  browserLocation: "/",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: "NEYNAR_FROG_FM" }),
});

app.frame("/", (c) => {
  const { buttonValue, status } = c;
  const answer = buttonValue;

  if (status == "initial") {
    index = new Date().getSeconds() % questionnaire.length;
  }
  const { question, options, correctAnswer } = questionnaire[index];

  // Define the background color based on the response status
  const backgroundColor =
    status === "response"
      ? answer === correctAnswer
        ? "linear-gradient(to bottom, #00C853, #17101F)"
        : "linear-gradient(to bottom, #D50000, #17101F)"
      : "linear-gradient(to bottom, #432889, #17101F)";

  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: backgroundColor,
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          {status === "response"
            ? answer === correctAnswer
              ? "Correct! Click on the Apply button to apply for the role."
              : "Incorrect! Give it another go."
            : question}
        </div>
      </div>
    ),
    intents: [
      ...options.map(
        (option) =>
          status === "initial" && <Button value={option}>{option}</Button>
      ),
      status === "response" && <Button.Reset>Reset</Button.Reset>,
      status === "response" && answer === correctAnswer && (
        <Button.Link href="https://calyptus.co/register/">Apply</Button.Link>
      ),
    ],
  });
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
