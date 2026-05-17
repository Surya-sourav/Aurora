export function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem('theme');var s=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';var r=(t==='system'||!t)?s:t;document.documentElement.setAttribute('data-theme',r);}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
