globalThis.process ??= {}; globalThis.process.env ??= {};
export { r as renderers } from '../chunks/_@astro-renderers_rEauAmOa.mjs';

const GET = async ({ redirect }) => {
  return redirect("/sitemap-index.xml", 301);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
