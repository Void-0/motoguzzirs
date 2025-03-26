(()=>{"use strict";document.addEventListener("DOMContentLoaded",(()=>{const e=document.getElementById("language-switcher-menu"),t=localStorage.getItem("language")||"sr";function n(e){fetch(`./assets/lang/${e}.json`,{cache:"no-store"}).then((t=>{if(!t.ok)throw new Error(`Failed to load language file for ${e}`);return t.json()})).then((t=>{const n=document.querySelector("#language-switcher"),a=n.querySelector("img"),o=document.querySelector("#language-switcher span");if(o)o.textContent=t.languageName;else{const e=document.createElement("span");e.textContent=t.languageName,n.prepend(e)}if(n)if(a)a.src=`./assets/icons/${e}.png`,a.alt=t.languageName;else{const a=document.createElement("img");a.src=`./assets/icons/${e}.png`,a.alt=t.languageName,n.prepend(a)}Object.entries(t.translations).forEach((([e,t])=>{document.querySelectorAll(e).forEach((e=>{e.textContent=t}))}))})).catch((e=>console.error("Error updating content:",e)))}fetch("./assets/lang/langlist.json",{cache:"no-store"}).then((e=>{if(!e.ok)throw new Error("Failed to load langlist.json");return e.json()})).then((e=>{const t=e.map((e=>{const t=e.replace(".json",""),n=`./assets/icons/${t}.png`;return fetch(`./assets/lang/${e}`,{cache:"no-store"}).then((e=>e.json())).then((e=>{const a=document.createElement("li");return a.setAttribute("data-language",t),a.innerHTML=`\n                <a>\n                  <img src="${n}" alt="${t}">\n                  <span>${e.languageName}</span>\n                </a>\n              `,a}))}));return Promise.all(t)})).then((t=>{t.forEach((t=>{t&&e.appendChild(t)}))})).catch((e=>console.error("Error populating the language switcher menu:",e))).then((()=>{e.addEventListener("click",(e=>{const t=e.target.closest("li");if(t){const e=t.getAttribute("data-language");localStorage.setItem("language",e),n(e)}})),n(t)}))}))})();