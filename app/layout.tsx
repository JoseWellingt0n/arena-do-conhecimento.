import type {Metadata} from "next";
import {Geist,Geist_Mono} from "next/font/google";
import "./globals.css";
const geist=Geist({variable:"--font-geist",subsets:["latin"]});
const mono=Geist_Mono({variable:"--font-mono",subsets:["latin"]});
export const metadata:Metadata={title:"Arena do Conhecimento | EREM Clóvis Beviláqua",description:"Desafios de Matemática e Português, ranking por equipes e preparação para o ENEM.",manifest:"/manifest.webmanifest",themeColor:"#6d5dfc",appleWebApp:{capable:true,statusBarStyle:"black-translucent",title:"Arena do Conhecimento"},other:{"codex-preview":"development"}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body className={`${geist.variable} ${mono.variable}`}>{children}</body></html>}
