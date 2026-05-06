import{c as p,r as u,j as m}from"./index-Cuyp8pCp.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],v=p("chevron-left",l);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],C=p("chevron-right",_),d="basecreator";function g(h,s={}){const{width:r,height:o,fit:i="fill",format:e="auto",quality:n="auto",gravity:c,effect:a}=s,t=[];r&&t.push(`w_${r}`),o&&t.push(`h_${o}`),i&&t.push(`c_${i}`),c&&t.push(`g_${c}`),e&&t.push(`f_${e}`),n!==void 0&&t.push(`q_${n}`),a&&t.push(a);const f=t.join(",");return`https://res.cloudinary.com/${d}/image/upload/${f}/${h}`}function w(h,s={}){const{width:r,height:o,fit:i="fill",format:e="auto",quality:n="auto",gravity:c,effect:a}=s,t=[];r&&t.push(`w_${r}`),o&&t.push(`h_${o}`),i&&t.push(`c_${i}`),c&&t.push(`g_${c}`),e&&t.push(`f_${e}`),n!==void 0&&t.push(`q_${n}`),a&&t.push(a);const f=t.join(",");return`https://res.cloudinary.com/${d}/video/upload/${f}/${h}`}function x({publicId:h,cloudinaryOptions:s={},fallbackSrc:r,alt:o,className:i,...e}){const n=g(h,s),[c,a]=u.useState(n),[t,f]=u.useState(!1),$=()=>{t||(f(!0),a(r||`https://placehold.co/${s.width??400}x${s.height??300}/1A1F4B/FFC857?text=${encodeURIComponent(o)}`))};return m.jsx("img",{src:c,alt:o,loading:"lazy",decoding:"async",onError:$,className:i,...e})}export{v as C,C as a,x as b,w as c};
