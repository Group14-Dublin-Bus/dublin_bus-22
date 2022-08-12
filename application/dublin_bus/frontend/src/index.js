import React from "react";
import { createRoot } from "react-dom/client";

import "../static/css/App.css";
import App from "./App";

// Render the app.js file, this is then passed to index.html to be bundled by webpack into main.js

const container = document.getElementById("app");
const root = createRoot(container);
root.render(
		<App />
);
