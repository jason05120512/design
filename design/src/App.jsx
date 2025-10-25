import React, { useState, useEffect } from "react";

export default function App() {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [items, setItems] = useState(sampleItems());
  const [selected, setSelected] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  function loginAsDemo() { setUser({ name: "小天" }); }
  function logout() { setUser(null); }
  function placeBid(itemId, amount) {
    setItems(prev => prev.map(it => {
      if(it.id !== itemId) return it;
      if(amount <= it.currentPrice) { alert("出價需高於目前最高價"); return it; }
      return {...it, currentPrice: amount, highestBidder: user ? user.name : "訪客"};
    }));
  }

  const visible = items.filter(it => {
    if(category !== "全部" && it.category !== category) return false;
    if(query && !`${it.title} ${it.description}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-blue-600 text-white">
      <header className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-wide flex items-center gap-2">
          <span className="text-amber-400">★</span> 流星精選網
        </h1>
        <nav className="flex items-center gap-3">
          <input className="px-3 py-2 rounded-md text-slate-900" placeholder="搜尋標的、關鍵字..." value={query} onChange={e => setQuery(e.target.value)} />
          <select className="px-3 py-2 rounded-md text-slate-900" value={category} onChange={e => setCategory(e.target.value)}>
            <option>全部</option><option>藝術</option><option>收藏</option><option>3C</option><option>家居</option>
          </select>
          {user ? (<div className="flex items-center gap-2">
            <span className="px-3 py-2 bg-white/10 rounded">{user.name}</span>
            <button onClick={logout} className="px-3 py-2 bg-white/20 rounded hover:bg-white/30">登出</button>
          </div>) : (<button onClick={loginAsDemo} className="px-4 py-2 rounded bg-amber-400 hover:bg-amber-500 text-slate-900 font-semibold">Demo 登入</button>)}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        <section className="md:col-span-3">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map(it => (<AuctionCard key={it.id} item={it} now={now} onOpen={() => setSelected(it)} />))}
          </div>
        </section>

        <aside className="bg-white/10 p-4 rounded-lg">
          <h2 className="font-semibold text-lg">快速操作</h2>
          <div className="mt-3 space-y-3">
            <div>
              <strong>即將結標</strong>
              <ul className="mt-2">
                {items.filter(i => i.endsAt > Date.now() && i.endsAt - Date.now() < 1000*60*60*24).slice(0,5).map(i => (<li key={i.id} className="text-sm">{i.title} — <small>{timeLeft(i.endsAt)}</small></li>))}
              </ul>
            </div>
            <div>
              <strong>我的追蹤</strong>
              <p className="text-sm mt-2">範例功能，實作可連資料庫</p>
            </div>
          </div>
        </aside>
      </main>

      <footer className="max-w-6xl mx-auto text-center p-6 text-white/60">
        © {new Date().getFullYear()} 流星精選網 — Demo 範例
      </footer>
    </div>
  );
}

function AuctionCard({item, now, onOpen}) {
  const left = item.endsAt - now;
  const ended = left <= 0;
  return (
    <div className="bg-white/5 p-4 rounded-xl shadow-lg hover:scale-[1.03] transition-transform">
      <div className="h-40 rounded overflow-hidden mb-3 bg-slate-700 flex items-center justify-center">
        <img src={item.image} alt={item.title} className="object-cover h-full w-full" />
      </div>
      <h3 className="font-semibold">{item.title}</h3>
      <p className="text-xs mt-1 text-white/70">{item.category} · {item.short}</p>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="text-sm">目前出價</div>
          <div className="font-bold text-xl text-amber-400">${item.currentPrice}</div>
          <div className="text-xs text-white/60">出價者：{item.highestBidder || '尚無'}</div>
        </div>
        <div className="text-right">
          <div className={`px-2 py-1 rounded ${ended ? 'bg-red-600' : 'bg-green-600'}`}>
            {ended ? '已結標' : timeLeft(item.endsAt)}
          </div>
          <button onClick={onOpen} className="mt-2 block px-3 py-1 rounded bg-white/10 hover:bg-white/20">查看 / 出價</button>
        </div>
      </div>
    </div>
  );
}

function sampleItems() {
  return [
    {id:1,title:"星空畫作",category:"藝術",short:"油畫",description:"美麗的夜空油畫",currentPrice:500,highestBidder:"",endsAt:Date.now()+3600*1000,image:"https://picsum.photos/200/200?random=1"},
    {id:2,title:"珍藏手辦",category:"收藏",short:"動漫手辦",description:"限量手辦",currentPrice:1200,highestBidder:"",endsAt:Date.now()+7200*1000,image:"https://picsum.photos/200/200?random=2"},
    {id:3,title:"3C 耳機",category:"3C",short:"藍牙耳機",description:"高音質藍牙耳機",currentPrice:800,highestBidder:"",endsAt:Date.now()+10800*1000,image:"https://picsum.photos/200/200?random=3"},
    {id:4,title:"裝飾小物",category:"家居",short:"擺設",description:"可愛小擺設",currentPrice:200,highestBidder:"",endsAt:Date.now()+5400*1000,image:"https://picsum.photos/200/200?random=4"}
  ];
}

function timeLeft(ts) {
  const s = Math.max(0, ts - Date.now())/1000;
  const h = Math.floor(s/3600); const m = Math.floor((s%3600)/60); const sec = Math.floor(s%60);
  return `${h}h ${m}m ${sec}s`;
}
