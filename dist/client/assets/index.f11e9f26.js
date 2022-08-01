import { j as jsxs, a as jsx, L as Link } from "./index.7d0f5deb.js";
function middleware() {
  return {
    props: "hello"
  };
}
function index({
  props
}) {
  return /* @__PURE__ */ jsxs("div", {
    children: ["about ", props, " ", /* @__PURE__ */ jsx(Link, {
      to: "/",
      children: "home"
    })]
  });
}
export {
  index as default,
  middleware
};
