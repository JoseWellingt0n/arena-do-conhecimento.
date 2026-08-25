export type PortugueseQuestion={topic:string;text:string;options:string[];answer:number;why:string;difficulty?:"Fácil"|"Médio"|"Difícil"};

const BASE_PORTUGUESE_BANK:Record<"1º"|"2º"|"3º",PortugueseQuestion[]>={
 "1º":[
  {topic:"Português • Interpretação",text:"No aviso 'Silêncio: prova em andamento', a finalidade principal é:",options:["Narrar um acontecimento","Dar uma orientação","Expressar uma opinião","Divulgar um produto"],answer:1,why:"O aviso orienta o comportamento de quem circula pelo local.",difficulty:"Fácil"},
  {topic:"Português • Gêneros textuais",text:"Qual gênero apresenta ingredientes e etapas para preparar um alimento?",options:["Notícia","Receita","Crônica","Entrevista"],answer:1,why:"A receita organiza ingredientes e modo de preparo.",difficulty:"Fácil"},
  {topic:"Português • Linguagem",text:"Uma placa com o desenho de uma bicicleta cortada por uma faixa vermelha utiliza principalmente linguagem:",options:["Verbal","Não verbal","Científica","Literária"],answer:1,why:"A mensagem é transmitida principalmente por imagem e símbolo.",difficulty:"Fácil"},
  {topic:"Português • Classes gramaticais",text:"Na frase 'A estudante respondeu rapidamente', a palavra 'rapidamente' é:",options:["Substantivo","Adjetivo","Advérbio","Pronome"],answer:2,why:"A palavra modifica o verbo 'respondeu', indicando modo.",difficulty:"Médio"},
  {topic:"Português • Variação linguística",text:"O uso de expressões diferentes em regiões do Brasil demonstra:",options:["Erro obrigatório","Variação linguística","Ausência de gramática","Linguagem universal"],answer:1,why:"A língua varia conforme região, grupo social, época e situação comunicativa.",difficulty:"Fácil"},
  {topic:"Português • Sentido",text:"Em 'O céu chorou durante toda a tarde', a expressão indica que:",options:["O céu ficou triste","Choveu por horas","Anoiteceu cedo","Houve muito vento"],answer:1,why:"A personificação do céu representa a chuva.",difficulty:"Médio"},
  {topic:"Português • Coesão",text:"Em 'Marina estudou muito, por isso foi aprovada', 'por isso' estabelece ideia de:",options:["Causa e consequência","Oposição","Comparação","Alternância"],answer:0,why:"A aprovação é apresentada como consequência do estudo.",difficulty:"Médio"},
  {topic:"Português • Ortografia",text:"Assinale a palavra escrita corretamente:",options:["Excessão","Exceção","Eceção","Excesssão"],answer:1,why:"A grafia correta é 'exceção'.",difficulty:"Fácil"},
  {topic:"Português • Pontuação",text:"Qual frase emprega corretamente a vírgula no vocativo?",options:["Pedro feche a porta.","Pedro, feche a porta.","Pedro feche, a porta.","Pedro, feche, a porta."],answer:1,why:"O nome da pessoa chamada é vocativo e deve ser isolado por vírgula.",difficulty:"Médio"},
  {topic:"Português • Pronomes",text:"Em 'Ela trouxe o livro', a palavra 'ela' substitui:",options:["Uma ação","Um nome","Uma qualidade","Uma circunstância"],answer:1,why:"O pronome pessoal retoma ou substitui um substantivo.",difficulty:"Fácil"},
  {topic:"Português • Interpretação",text:"Em uma campanha com a frase 'Cada gota conta', o objetivo mais provável é:",options:["Incentivar o consumo","Combater o desperdício de água","Vender bebidas","Ensinar natação"],answer:1,why:"A frase busca conscientizar sobre o uso responsável da água.",difficulty:"Médio"},
  {topic:"Português • Figuras de linguagem",text:"Em 'Estou morrendo de fome', ocorre:",options:["Eufemismo","Hipérbole","Antítese","Metonímia"],answer:1,why:"Há exagero intencional para intensificar a fome.",difficulty:"Médio"}
 ],
 "2º":[
  {topic:"Português • Sintaxe",text:"Em 'Os alunos organizaram a feira', o sujeito é:",options:["A feira","Organizaram","Os alunos","A escola"],answer:2,why:"'Os alunos' é quem pratica a ação verbal.",difficulty:"Fácil"},
  {topic:"Português • Concordância",text:"Assinale a frase de acordo com a norma-padrão:",options:["Fazem dois anos que estudo aqui.","Faz dois anos que estudo aqui.","Houveram muitas dúvidas.","Existe muitos motivos."],answer:1,why:"O verbo 'fazer', indicando tempo decorrido, é impessoal e fica no singular.",difficulty:"Médio"},
  {topic:"Português • Regência",text:"Segundo a norma-padrão, qual frase está correta?",options:["Assisti o filme ontem.","Assisti ao filme ontem.","Prefiro mais café do que chá.","Cheguei no colégio cedo."],answer:1,why:"No sentido de ver, 'assistir' rege a preposição 'a'.",difficulty:"Médio"},
  {topic:"Português • Figuras de linguagem",text:"Em 'A cidade acordou apressada', ocorre:",options:["Personificação","Pleonasmo","Ironia","Comparação"],answer:0,why:"Uma característica humana é atribuída à cidade.",difficulty:"Fácil"},
  {topic:"Português • Literatura",text:"Uma característica marcante do Romantismo brasileiro é:",options:["Objetividade científica","Idealização e subjetividade","Linguagem exclusivamente técnica","Rejeição da natureza"],answer:1,why:"O Romantismo valoriza emoção, subjetividade e idealização.",difficulty:"Médio"},
  {topic:"Português • Interpretação",text:"Quando um autor apresenta dados e cita especialistas, ele busca principalmente:",options:["Criar suspense","Dar credibilidade ao texto","Produzir humor","Ocultar o tema"],answer:1,why:"Dados e vozes especializadas fortalecem a argumentação.",difficulty:"Médio"},
  {topic:"Português • Orações",text:"Em 'Estudei porque teria prova', a conjunção 'porque' expressa:",options:["Causa","Condição","Conclusão","Oposição"],answer:0,why:"A prova é a causa do estudo.",difficulty:"Fácil"},
  {topic:"Português • Crase",text:"Assinale a alternativa com uso correto da crase:",options:["Fui à escola.","Entreguei à João.","Cheguei à pé.","Vou à Recife."],answer:0,why:"Há fusão da preposição 'a' com o artigo feminino de 'a escola'.",difficulty:"Médio"},
  {topic:"Português • Semântica",text:"As palavras 'comprido' e 'cumprido' são exemplos de:",options:["Sinônimos","Antônimos","Parônimos","Homônimos perfeitos"],answer:2,why:"São semelhantes na escrita e pronúncia, mas têm sentidos diferentes.",difficulty:"Difícil"},
  {topic:"Português • Pontuação",text:"Em qual alternativa os dois-pontos introduzem uma explicação?",options:["Ele trouxe três itens: lápis, régua e caderno.","Ele chegou: porém saiu.","Maria: estudou muito.","O dia: estava lindo."],answer:0,why:"Os dois-pontos introduzem a enumeração que explica 'três itens'.",difficulty:"Médio"},
  {topic:"Português • Literatura",text:"O Realismo costuma apresentar:",options:["Idealização amorosa","Análise crítica da sociedade","Heróis medievais","Fuga completa da realidade"],answer:1,why:"O Realismo observa criticamente comportamentos e estruturas sociais.",difficulty:"Médio"},
  {topic:"Português • Vozes verbais",text:"Em 'A feira foi organizada pelos estudantes', a oração está na voz:",options:["Ativa","Passiva","Reflexiva","Imperativa"],answer:1,why:"O sujeito recebe a ação, praticada pelo agente da passiva.",difficulty:"Médio"}
 ],
 "3º":[
  {topic:"Português • ENEM",text:"Em um texto argumentativo, a tese corresponde:",options:["Ao título obrigatório","À ideia central defendida","A qualquer exemplo","À referência bibliográfica"],answer:1,why:"A tese é o ponto de vista central sustentado pelos argumentos.",difficulty:"Fácil"},
  {topic:"Português • Funções da linguagem",text:"Em uma propaganda que procura convencer o consumidor, predomina a função:",options:["Emotiva","Conativa","Metalinguística","Fática"],answer:1,why:"A função conativa busca influenciar o receptor.",difficulty:"Médio"},
  {topic:"Português • Coesão",text:"Qual conectivo expressa oposição?",options:["Portanto","Além disso","Entretanto","Porque"],answer:2,why:"'Entretanto' introduz uma ideia contrária à anterior.",difficulty:"Fácil"},
  {topic:"Português • Coerência",text:"Um texto é coerente quando:",options:["Possui frases muito longas","Suas ideias formam um sentido lógico","Usa somente linguagem formal","Repete sempre a mesma palavra"],answer:1,why:"Coerência é a articulação lógica e compreensível das ideias.",difficulty:"Fácil"},
  {topic:"Português • Literatura",text:"A primeira fase do Modernismo brasileiro defendia principalmente:",options:["Rigidez das formas clássicas","Ruptura e experimentação","Retorno exclusivo ao latim","Imitação dos autores portugueses"],answer:1,why:"Os modernistas buscavam liberdade formal e renovação artística.",difficulty:"Médio"},
  {topic:"Português • Gramática contextualizada",text:"Em 'Embora estivesse cansada, continuou estudando', a conjunção indica:",options:["Conclusão","Concessão","Explicação","Finalidade"],answer:1,why:"'Embora' introduz um fato que não impede a ação principal.",difficulty:"Médio"},
  {topic:"Português • Interpretação",text:"A ironia ocorre quando o enunciado:",options:["Diz exatamente o que pretende","Sugere sentido diferente ou contrário ao literal","Não possui qualquer sentido","Apresenta somente números"],answer:1,why:"A ironia depende da diferença entre o sentido literal e o pretendido.",difficulty:"Médio"},
  {topic:"Português • ENEM",text:"Na redação do ENEM, a proposta de intervenção deve:",options:["Desrespeitar direitos humanos","Ser desconectada da discussão","Apresentar ação relacionada ao problema","Substituir toda a argumentação"],answer:2,why:"A intervenção precisa dialogar com o problema discutido e respeitar os direitos humanos.",difficulty:"Médio"},
  {topic:"Português • Intertextualidade",text:"Quando um texto retoma ou transforma outro texto, ocorre:",options:["Intertextualidade","Ambiguidade obrigatória","Denotação","Pleonasmo"],answer:0,why:"Intertextualidade é a relação estabelecida entre textos.",difficulty:"Médio"},
  {topic:"Português • Variação linguística",text:"Em uma entrevista de emprego, adequar a linguagem significa:",options:["Abandonar a identidade do falante","Escolher o registro apropriado à situação","Usar sempre gírias","Evitar qualquer comunicação"],answer:1,why:"A adequação linguística considera contexto, objetivo e interlocutor.",difficulty:"Fácil"},
  {topic:"Português • Ambiguidade",text:"A frase 'Vi o aluno com o binóculo' é ambígua porque:",options:["Não possui verbo","Permite mais de uma interpretação","Está sem sujeito","Apresenta erro ortográfico"],answer:1,why:"Pode indicar que alguém usou o binóculo ou que o aluno o carregava.",difficulty:"Difícil"},
  {topic:"Português • Argumentação",text:"Um argumento baseado em pesquisa estatística é classificado como argumento de:",options:["Humor","Dados concretos","Senso comum","Narração fantástica"],answer:1,why:"Resultados de pesquisas funcionam como evidências objetivas.",difficulty:"Médio"}
 ]
};

const synonymPairs=[["feliz","contente"],["rápido","veloz"],["iniciar","começar"],["auxílio","ajuda"],["amplo","vasto"],["calmo","tranquilo"],["essencial","indispensável"],["observar","notar"],["corajoso","valente"],["residir","morar"]];
const antonymPairs=[["claro","escuro"],["generoso","egoísta"],["antigo","moderno"],["aproximar","afastar"],["permitir","proibir"],["otimista","pessimista"],["aumentar","reduzir"],["simples","complexo"],["aceitar","recusar"],["construir","destruir"]];
const spellings=[["beneficente","beneficiente","benefissente","benefiscente"],["privilégio","previlégio","priviléjio","previléjio"],["empecilho","impecilho","empecílio","impecílio"],["reivindicar","reinvindicar","reivendicar","reinvendicar"],["exceção","excessão","esceção","excesssão"],["mexer","mecher","mexe","mescher"],["analisar","analizar","anallisar","analissar"],["consciência","conciencia","consciênsia","conciência"]];
const connectiveItems=[
 ["Estudou bastante; ___, obteve um bom resultado.","portanto",["porém","porque","embora"]],
 ["Queria participar, ___ estava doente.","mas",["logo","portanto","porque"]],
 ["Levou o guarda-chuva ___ havia previsão de chuva.","porque",["contudo","logo","embora"]],
 ["___ estivesse cansado, terminou o trabalho.","Embora",["Porque","Portanto","Além disso"]],
 ["A leitura amplia o vocabulário; ___, desenvolve a interpretação.","além disso",["porém","apesar disso","porque"]],
 ["Não apenas estudou, ___ também ajudou os colegas.","mas",["porque","logo","contudo"]],
 ["O texto apresenta bons dados; ___, sua conclusão é frágil.","entretanto",["portanto","porque","assim"]],
 ["Organize o tempo ___ consiga concluir a prova.","para que",["contudo","visto que","ainda que"]],
 ["A escola economizou água; ___, reduziu os gastos.","desse modo",["embora","porque","todavia"]],
 ["___ o aviso, muitos chegaram atrasados.","Apesar de",["Portanto","Porque","Assim"]]
] as const;

function generatedQuestions(year:"1º"|"2º"|"3º"):PortugueseQuestion[]{
 const level=(index:number):PortugueseQuestion["difficulty"]=>index<12?"Fácil":index<28?"Médio":"Difícil";
 const synonyms=synonymPairs.map(([word,right],index)=>({topic:"Português • Semântica",text:`No contexto da norma-padrão, qual palavra pode substituir “${word}” sem alterar o sentido principal?`,options:[right,"distante","contrário","incerto"],answer:0,why:`“${right}” é sinônimo de “${word}”.`,difficulty:level(index)}));
 const antonyms=antonymPairs.map(([word,right],index)=>({topic:"Português • Semântica",text:`Assinale o antônimo de “${word}”:`,options:["semelhante",right,"equivalente","relacionado"],answer:1,why:`“${right}” apresenta sentido oposto a “${word}”.`,difficulty:level(index+10)}));
 const spelling=spellings.map((items,index)=>({topic:"Português • Ortografia",text:"Assinale a palavra escrita corretamente de acordo com a norma-padrão:",options:items,answer:0,why:`A grafia correta é “${items[0]}”.`,difficulty:level(index+20)}));
 const connectives=connectiveItems.map(([text,right,wrong],index)=>({topic:year==="3º"?"Português • Coesão ENEM":"Português • Coesão",text,options:[right,...wrong],answer:0,why:`O conectivo “${right}” estabelece a relação lógica adequada entre as ideias.`,difficulty:level(index+28)}));
 return [...synonyms,...antonyms,...spelling,...connectives];
}

export const PORTUGUESE_BANK:Record<"1º"|"2º"|"3º",PortugueseQuestion[]>={
 "1º":[...BASE_PORTUGUESE_BANK["1º"],...generatedQuestions("1º")].slice(0,50),
 "2º":[...BASE_PORTUGUESE_BANK["2º"],...generatedQuestions("2º")].slice(0,50),
 "3º":[...BASE_PORTUGUESE_BANK["3º"],...generatedQuestions("3º")].slice(0,50),
};
