if(!self.define){let e,s={};const a=(a,i)=>(a=new URL(a+".js",i).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(i,t)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let c={};const l=e=>a(e,n),r={module:{uri:n},exports:c,require:l};s[n]=Promise.all(i.map((e=>r[e]||l(e)))).then((e=>(t(...e),c)))}}define(["./workbox-e9849328"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"2dbdb59fd0b846ff6c75806d642453cf"},{url:"/_next/static/BlKjPlHeCdr1IpyOaVtHl/_buildManifest.js",revision:"e3d5005f7478a3fad26c7971cda1c684"},{url:"/_next/static/BlKjPlHeCdr1IpyOaVtHl/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/106-870e7406af289009.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/1135b3d0-da03dd2952943e70.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/136-d141c6b4503e1a9d.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/266-c89c68cd5f15557b.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/268.c817d7ee9ac933af.js",revision:"c817d7ee9ac933af"},{url:"/_next/static/chunks/32-67822d989d6235ea.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/354-c304011450ea5042.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/376-f98a00dc395c04c0.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/387-ebddcea3e11a7cce.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/3fc60c6a-a8015461d1935636.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/521.83c8ab341846cfcf.js",revision:"83c8ab341846cfcf"},{url:"/_next/static/chunks/615-f7154f4a4386ad78.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/763-380a3b59b1e9f30d.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/85-2644b76bc510374a.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/860-97deb3eaff85fd61.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/895-d18a06da993c9456.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/ac6470ab-a5273cfafbf02e67.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/app/(auth)/api/auth/%5B...nextauth%5D/route-b0e19d8ed82bec0b.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/app/(auth)/login/page-931423ec8a08edb1.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/app/(auth)/register/page-f882fc66bf454fe8.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/app/(chat)/api/chat/route-b263176e5e9ae137.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/app/(chat)/api/document/route-3966d1612e602fb6.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/app/(chat)/api/files/upload/route-154e11d0373c642a.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/app/(chat)/api/history/route-5df16806a298a372.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/app/(chat)/api/suggestions/route-d8e9d7a1ad4c006f.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/app/(chat)/api/vote/route-5eecaf5c4b7711ab.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/app/(chat)/chat/%5Bid%5D/page-8c21eece33140c2d.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/app/(chat)/layout-58e8b654599152f2.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/app/(chat)/page-2991f2550bc6f931.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/app/_not-found/page-a9e499029c4b5f04.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/app/api/ping/route-9b4d29d6e7cfb86b.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/app/layout-1f7a560f04d1e8ee.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/app/offline/page-aaff69dbe09440af.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/app/rtl-test/page-c458adb765cf3cf2.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/c346c9a1-af02b74d27dd3dfb.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/e5239f05-cd9f46e3d2ec8e40.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/framework-c763f0d3b8c9389f.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/main-0d4d90eb2daaf44c.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/main-app-8ff5a6f135bb4052.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/pages/_app-2b384584cd9edcc0.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/pages/_error-3d42f8061feb2939.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-bfa7336ec10baf43.js",revision:"BlKjPlHeCdr1IpyOaVtHl"},{url:"/_next/static/css/626f1e37715cd746.css",revision:"626f1e37715cd746"},{url:"/_next/static/css/d8445e914ba3588c.css",revision:"d8445e914ba3588c"},{url:"/apple-touch-icon.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/fonts/dubai/Dubai-300.woff2",revision:"1fdd77fd1fcc9af3380e2ba46a8376ed"},{url:"/fonts/dubai/Dubai-400.woff2",revision:"0ad3fba8431bcea4ca7b2db3f7d4d088"},{url:"/fonts/dubai/Dubai-500.woff2",revision:"4bdee4188ae1495932d9c6ba3ffa3cad"},{url:"/fonts/dubai/Dubai-700.woff2",revision:"3ac5f2dbb1ff9e996cec704719e165cc"},{url:"/fonts/geist-mono.woff2",revision:"40adfa726676daa4538fc84bc3265438"},{url:"/fonts/geist.woff2",revision:"77df216a9074b143839afadcd09dc769"},{url:"/images/demo-thumbnail.png",revision:"8edf699c89bc92a23b5ff482f8f6eb0d"},{url:"/images/icons/apple-touch-icon.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/images/icons/icon-192x192-maskable.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/images/icons/icon-192x192.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/images/icons/icon-384x384.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/images/icons/icon-512x512-maskable.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/images/icons/icon-512x512.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/images/icons/icon-template.svg",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"/images/math_tutor_ico.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/images/math_tutor_logo.png",revision:"d03a33ffb05dc3394647e197fa337148"},{url:"/images/mouth of the seine, monet.jpg",revision:"646247b9307468a3cbbf697a5ac9a46b"},{url:"/images/screenshots/mobile1.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/images/screenshots/mobile2.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/images/screenshots/screen1.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/images/screenshots/screen2.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/images/splash/apple-splash-1125-2436.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/images/splash/apple-splash-1242-2688.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/images/splash/apple-splash-1536-2048.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/images/splash/apple-splash-1668-2388.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/images/splash/apple-splash-2048-2732.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/images/splash/apple-splash-640-1136.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/images/splash/apple-splash-750-1334.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/images/splash/apple-splash-828-1792.png",revision:"338246b4e05d0762cb8bb5fd4607b5d5"},{url:"/manifest.json",revision:"ba0a0ccbe0fca4edcf61718319866074"},{url:"/pwa-test.html",revision:"f8df513ff456b8b4ccfd339608f9d36b"},{url:"/sw.js",revision:"19cf335778df39a9d3e5885ab1ccf89f"},{url:"/uploads/basic-math-problems-13-042a743f-c88b-47f8-b891-455fd663134f.jpg",revision:"1aa81781bdedc18a11a310333b7cfb50"},{url:"/uploads/basic-math-problems-13-54bf1017-7dfc-4d8b-bef5-386bab981710.jpg",revision:"1aa81781bdedc18a11a310333b7cfb50"},{url:"/uploads/basic-math-problems-13-59516441-4656-462d-a04e-c674040712d7.jpg",revision:"1aa81781bdedc18a11a310333b7cfb50"},{url:"/uploads/basic-math-problems-13-60d0824b-4df5-42ac-aa5d-bb87e305479f.jpg",revision:"1aa81781bdedc18a11a310333b7cfb50"},{url:"/uploads/basic-math-problems-13-b1d9d039-7170-4fab-b0a9-0a1986c1d0ec.jpg",revision:"1aa81781bdedc18a11a310333b7cfb50"},{url:"/uploads/basic-math-problems-13-ce701969-0a5c-4760-9619-ce028c96f48b.jpg",revision:"1aa81781bdedc18a11a310333b7cfb50"},{url:"/workbox-e9849328.js",revision:"9647ce85c9195576aae12296ab4f124e"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:i})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
