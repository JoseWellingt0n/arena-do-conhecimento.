import Link from "next/link";

export default function AccessPortal(){
 return <main className="access-portal">
  <div className="portal-glow one"/><div className="portal-glow two"/>
  <section className="portal-shell">
   <header className="portal-brand"><div><img src="/logo-erem-clovis-bevilaqua.png" alt="Logo da EREM Clóvis Beviláqua"/></div><p>EREM CLÓVIS BEVILÁQUA</p><h1>Arena do <span>Conhecimento</span></h1><small>Escolha como você deseja entrar</small></header>
   <div className="portal-options">
    <Link className="portal-card student" href="/jogo"><i>✦</i><span><b>Sou estudante</b><small>Entrar no desafio, responder questões e acompanhar o ranking.</small></span><em>Começar →</em></Link>
    <Link className="portal-card admin" href="/admin"><i>◆</i><span><b>Sou administrador</b><small>Gerenciar competições, estudantes e resultados da escola.</small></span><em>Entrar com senha →</em></Link>
   </div>
   <Link className="projector-access" href="/projector">▣ Abrir telão da competição</Link>
   <footer><span>Ambiente educacional seguro</span><span>Jogos Internos • 2026</span></footer>
  </section>
 </main>
}
