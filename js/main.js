import { wireEvents } from "./events.js";
import { render } from "./render.js";
import { connectDoc } from "./sync.js";

wireEvents();
render();
connectDoc();
