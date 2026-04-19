export default {
  async fetch(request, env) {
    // Keep site-data on the current Worker deployment so daily refresh commits
    // on main become live without waiting for baseline Pages parity updates.
    const requestUrl = new URL(request.url);
    if (requestUrl.pathname === '/site-data.json' && env?.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    // Emergency pin: proxy to known-good deployment while source parity is resolved.
    const incomingUrl = new URL(request.url);

    const isAboutTypographyHost =
      incomingUrl.hostname === 'wispy-sun-811e.krakenwatch.workers.dev' ||
      incomingUrl.hostname === 'krakenwatch.com';

    // Host-scoped asset route: serve Blackbeard from local worker assets so the
    // About override can load the actual font file instead of HTML fallback.
    if (
      isAboutTypographyHost &&
      incomingUrl.pathname === '/fonts/blackbeard.woff' &&
      env &&
      env.ASSETS
    ) {
      return env.ASSETS.fetch(request);
    }

    const url = new URL(request.url);
    url.hostname = '1d2a3088.krakenwatch.pages.dev';

    const response = await fetch(new Request(url.toString(), request));

    // Host-scoped tweak: use Blackbeard for About page body text.
    if (
      isAboutTypographyHost &&
      (response.headers.get('content-type') || '').includes('text/html')
    ) {
      const html = await response.text();
      const patched = html.replace(
        '</head>',
        '<style id="about-blackbeard-test-only">@font-face{font-family:"Blackbeard";font-style:normal;font-weight:400;font-display:swap;src:url("/fonts/blackbeard.woff") format("woff")}p.text-base, p.text-base.sm\\:text-lg{font-family:"Blackbeard","Trade Winds",Georgia,serif!important;line-height:1.5;letter-spacing:.01em;text-align:left!important}</style><script id="about-copy-live-patch">(function(){const aboutSentence="Kraken Watch set sail in April 2026 to plunder signals, scuttlebutt, and actionable insight from across the vast seas of Kraken, Payward, Ink, and the rising frontier of digital assets beyond.";const linkClass="font-semibold underline decoration-dotted underline-offset-2 hover:opacity-70 transition-opacity";const linkStyle="color: hsl(350 55% 32%)";const joinHtml=\'Join the crew on <a href="https://x.com/KrakWatch" target="_blank" rel="noopener noreferrer" class="\'+linkClass+\'" style="\'+linkStyle+\'">@krakwatch</a> on X 🏴‍☠️\';const createdHtml=\'Created by <a href="https://x.com/salwilliam" target="_blank" rel="noopener noreferrer" class="\'+linkClass+\'" style="\'+linkStyle+\'">@salwilliam</a>\';function patchAbout(){const heading=[...document.querySelectorAll("h1")].find((el)=>el.textContent&&el.textContent.includes("Ahoy, matey!"));if(!heading){return;}const container=heading.parentElement;if(!container){return;}const paragraphs=[...container.querySelectorAll("p.text-base, p.text-base.sm\\\\:text-lg")];if(!paragraphs.length){return;}const cloneFrom=paragraphs[0];const ensureParagraph=(index)=>{if(paragraphs[index]){return paragraphs[index];}const p=document.createElement("p");p.className=cloneFrom.className;const style=cloneFrom.getAttribute("style");if(style){p.setAttribute("style",style);}const anchor=index===1?paragraphs[0]:paragraphs[index-1];anchor.after(p);paragraphs[index]=p;return p;};const aboutP=ensureParagraph(0);aboutP.textContent=aboutSentence;const joinP=ensureParagraph(1);joinP.innerHTML=joinHtml;const createdP=ensureParagraph(2);createdP.innerHTML=createdHtml;}function run(){try{patchAbout();}catch(e){}}if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",run,{once:true});}run();new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});})();</script></head>',
      );
      return new Response(patched, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    }

    return response;
  },
};
