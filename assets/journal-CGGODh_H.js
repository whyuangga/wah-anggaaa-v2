const m=`---
title: selamat datang di jurnal
date: 2026-09-11
desc: Kenapa situs iseng ini punya jurnal, dan janji untuk tidak pernah konsisten.
tags: [meta, iseng]
---

Ini adalah tulisan pertama di jurnal — yang kemungkinan besar juga akan jadi tulisan yang paling rajin dirawat. Sisanya ya lihat nanti.

## kenapa ada jurnal?

Awalnya situs ini cuma mau jadi galeri: sebelas situs fiktif, dipajang, selesai. Tapi galeri tanpa suara terasa seperti museum tanpa pemandu — bagus dilihat, cepat dilupakan.

Jadi jurnal ini adalah pemandunya. Isinya:

- **catatan proses** — kenapa sebuah situs dibuat seperti itu, bukan seperti ini
- **eksperimen gagal** — karena yang gagal biasanya lebih seru diceritakan
- **opini sok tahu** — soal tipografi, warna, dan kenapa marquee dilarang di situs ini

## janji jurnal

Satu janji saja: *tidak ada jadwal terbit*. Jurnal yang memaksa diri terbit tiap minggu biasanya mati di bulan ketiga. Jurnal ini memilih hidup malas tapi lama.

> Konsistensi adalah beban. Keisengan adalah bahan bakar.

Kalau suatu hari ada tulisan kedua, berarti keisengannya masih menyala. Kalau tidak, ya sudah — sebelas situs fiktif di atas tetap bisa dinikmati tanpa penjelasan apa pun.

Sampai jumpa di tulisan berikutnya. Kapan-kapan.
`,g=Object.assign({"../../content/journal/selamat-datang-di-jurnal.md":m});function d(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function u(t){return d(t).replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/(^|[\s(])\*([^*\n]+)\*/g,"$1<em>$2</em>").replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')}function h(t){const i=t.split(`
`);let n="",a=0,s=!1;const r=()=>{s&&(n+="</ul>",s=!1)};for(;a<i.length;){const e=i[a];if(e.startsWith("```")){r();const c=[];for(a++;a<i.length&&!i[a].startsWith("```");)c.push(i[a++]);n+=`<pre><code>${d(c.join(`
`))}</code></pre>`,a++;continue}const l=e.match(/^##\s+(.+)$/);if(l){r(),n+=`<h2>${u(l[1])}</h2>`,a++;continue}const o=e.match(/^#\s+(.+)$/);if(o){r(),n+=`<h2>${u(o[1])}</h2>`,a++;continue}if(e.startsWith("> ")){r(),n+=`<blockquote>${u(e.replace(/^>\s?/,""))}</blockquote>`,a++;continue}const p=e.match(/^-\s+(.+)$/);if(p){s||(n+="<ul>",s=!0),n+=`<li>${u(p[1])}</li>`,a++;continue}if(/^---+$/.test(e.trim())){r(),n+="<hr />",a++;continue}if(e.trim()===""){r(),a++;continue}r(),n+=`<p>${u(e)}</p>`,a++}return r(),n}function f(t,i){const n=i.split("/").pop().replace(/\.md$/,""),a=t.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);if(!a)throw new Error(`frontmatter hilang: ${n}`);const s={};for(const e of a[1].split(`
`)){const l=e.match(/^(\w+):\s*(.+)$/);l&&(s[l[1]]=l[2].trim())}const r=(s.tags??"").replace(/^\[|\]$/g,"").split(",").map(e=>e.trim()).filter(Boolean);return{slug:n,title:s.title??n,date:s.date??"",desc:s.desc??"",tags:r,html:h(a[2].trim())}}const k=Object.entries(g).map(([t,i])=>f(i,t)).sort((t,i)=>t.date<i.date?1:-1);function b(t){const[i,n,a]=t.split("-").map(Number);return`${a} ${["jan","feb","mar","apr","mei","jun","jul","agu","sep","okt","nov","des"][n-1]} ${i}`}export{k as P,b as f};
