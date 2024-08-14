First reference: https://www.gorillasun.de/blog/an-algorithm-for-particle-systems-with-collisions/

He is not using the masses to calculate the impulse, as mentioned in the post's code block (it's different from the actual P5 code).

We shouldn't use the particle's masses for the repulsion, but their radix(?).

Improvements for the particle version with grid lookup (from https://www.gorillasun.de/blog/particle-system-optimization-grid-lookup-spatial-hashing/):
* We only need to check for collision with the canvas boundaries if the particle is in one of the grid cells located at the border of the grid.
* [already implemented] We also only need to update a particle's grid cell if it's new position falls into a new grid cell.

https://en.wikipedia.org/wiki/Elastic_collision

![](./prints/ellastic-collision.png)

bola pequena às vezes orbita a grande

## COISAS A RESOLVER NA FRENTE

* Usar Bézier em vez de linhas? `quadraticCurveTo(cpx, cpy, x, y)`

`(cpx, cpy)` poderiam ser encontrados usando `[ (pa - pcenter) + (pb - pcenter) ] * c`, onde `c > 1/2` (`c = 1/2` posicionaria o ponto de controle no ponto médio dos dois pontos). Fazer interativo.

* colliders maiores que os pontos, para evitar penetração

## 2024.03.20

Particle system seems to be working. Going to try implementing the spring-mass system.

Worked. But not the circular structures.

> It kind of blows my mind that with relatively little such an interesting system emerges. The beauty of emergence: the mesh doesn't really know that it exists, it's simply the particles and springs working in tandem to create this intricate and dynamic structure.
(https://www.gorillasun.de/blog/spring-physics-and-connecting-particles-with-springs/)

Refatorar tudo.

## 2024.03.29

Seguindo agora o Makyta

Gauss formula para área de polígono:
https://www.thecivilengineer.org/education/professional-examinations-preparation/calculation-examples/calculation-example-three-point-resection

Melhor aqui (Shoelace formula): https://en.wikipedia.org/wiki/Shoelace_formula

Verlet integration: 
https://en.wikipedia.org/wiki/Verlet_integration

Leapfrog integration
https://en.wikipedia.org/wiki/Leapfrog_integration

Velocity Verlet

Pressure factor can be used to deflate / inflate the blobs

## 2024.03.30, madrugada

it works! for one blob, no collisions, though.

Check wall collisions

## 2024.04.04

Millington, Chapter 7. Collision resolution.

## 2024.04.09

Back to work.

Trying to build the grid lookup for the spatial hashing.

Playing with some of the parameters, those will be fundamental to achieve the visual effect we're aiming at.

For lower time-steps, we need lower (meaning, stronger) velocity damping to help stabilize the system. Time steps of 50 seem to work well.

## 2024.04.10

Higher stiffness make the blobs blobbier when under contact.

Gas constant and stiffness constant impact in the final blob size compared to its reference circle.

## 2024.04.11

Building the collision system. Based on Millington, chapter 7. Thinking if I need to iterate over all particles or over all cells, and whether that makes any difference.

Collisions with rods / springs? Not on this version.

Smaller radius seem more unstable for lower time steps.

Parametrizar particle radius.

No collision detection, ignorar as partículas adjacentes. Talvez adicionar índice às partículas.

Experimentar com mais springs também.

Relação time_step x velocity damping. Smaller blobs seem more instable, but increasing the time step makes them stabilize, just like reducing the velocity damping factor (thus increasing the damping) would.

Calcula theta de acordo com R do blob e r das partículas. E depois recalcula o theta para ficar perfeito.

Time_step 70 parece funcionar bem.

## 2024.04.12

Ajustes na detecção de colisões, havia um erro no código que ignorava os vizinhos imediatos. Acrescentei botão para controlar o display dos colliders.

Agora vamos a implementar a resolução de colisões.

Funcionou!

Como evitar emaranhados?

Melhorar a história de colorir os colliders.

Larger colliders would avoid the problem of particles traversing each other, or traversing the boundaries...

"In an essence, yes. But there are some tricks that happen during the collision detection, like offsetting the colliders based on the surface normals and some other factors." (https://x.com/JuhaniHalkomaki/status/1727620541316534351)

"alright, I thought it was based of a paper which I saw ages ago 🙃https://panoramx.ift.uni.wroc.pl/~maq/soft2d/howtosoftbody.pdf"
https://x.com/banterless_ai/status/1727729376106553525

Inspirations:
First, Daniel:
https://x.com/shiffman/status/1638561972928106498
then:
https://x.com/JuhaniHalkomaki/status/1629184126837305347
and then:
https://x.com/JuhaniHalkomaki/status/1727409502327300435
and then:
https://x.com/JuhaniHalkomaki/status/1624761948402319360

Escrevi pro Juhani.

Tentando evitar micro-vibrações. Aplicando esse conceito de "RESTING CONTACTS", do Millington (7.2.3). Calculando a velocidade da partícula devido à aplicação da aceleração em um frame, se for maior do que a velocidade atual, é por causa desse problema de resting contacts. Mas não está elegante, melhorar.

A solução anterior funcionou, mas depende do coeficiente de restituição, de acordo com os tamanhos das partículas.
DT também tem influência na vibração.

Experimentando uma nova forma de interação. Criar uma partícula, uma nova classe?

Juhani, no Instagram
> the same effect could be achieved using available physics libraries. But I like to understand things and to solve puzzles. Figuring it out on my own checks both of these boxes.

Próximos passos: 

1. Testar colliders maiores com offset. Vai permitir controlar a separação entre os blobs e evitar interpenetração de um blob em outro.
2. Criar uma estrutura de visualização propriamente dita... calcular escalas de áreas conforme um conjunto de dados, labels etc.
3. Fazer um interativo para testar diferentes tipos de contorno dos blobs.
4. Criar uma partícula na posição do mouse.
5. Remover top boundary

# 2024.04.16

O que é estranho é que quando o sistema começa a demonstrar instabilidade, vc aumenta o time step, ele estabilizar, e depois vc reduz de novo e ele continua estável.

Talvez incluir um contador, e, toda vez que houver interação, zerar o contador. Depois que chegar na quantidade de iterações, parar a simulação. Fiz um exemplo num commit, pode funcionar.

# 2024.04.20

Depois da reunião com Björn: avaliação. Engagement questionnaire.

Implements new colliders. 

```js
    update_collider_position() {

        this.collider_radius = params.COLLIDERS_RADIUS >= (this.blob_radius + this.r) ? this.blob_radius + this.r : params.COLLIDERS_RADIUS; 
        const distance_from_blob_center = this.blob_radius + this.r  - this.collider_radius;
        const unit_radial_vector = Vec.sub(this.pos, this.blob_center).getUnitDir();
        this.collider_center = Vec.add(
            this.blob_center, 
            Vec.mult(unit_radial_vector, distance_from_blob_center + this.r)
        );

        //console.log(distance_from_blob_center, this.r, this.blob_center, this.collider_radius, this.collider_center);

    }
```

When determining the collisions, we should stop in the first collision, because we'll have many simultaneous collisions with the big colliders.

In the way I am implementing it, the collider will always be positioned according to the blob center. But we want it according to the particle position instead! We must calculate it position from the particle position. It should be `p + (p_r - c_r) unit_radial_vector`.

To-do:

* Testar colliders internos (que na verdade vão ficar meio externos)
* Calcular normais para cada vértice / partícula
* Ver na Biblioteca acesso ao Dagens Nyheter.


2024-04-29

A interação até que está funcionando de forma interessante, pq se vc move muito rápido a "partícula" de interação entra no blob e começa a puxá-lo.

Implementar uma forma de escolher o tipo de interação?

Resolver esse problema do grid. Talvez criar mais células fantasma além dos limites.

2024-05-01

Resolvido isso "Resolver esse problema do grid. Talvez criar mais células fantasma além dos limites.". O problema eram as springs que ficam com tamanho igual a zero.

Agora tem um problema de mover muito rápido a partícula de interação. Mas não trava a simulação.

(ver print!) O que são essas possíveis colisões externas??

Situação satisfatória. Agora é fazer uma aplicação de verdade. Principalmente começando com isso:

*Desafio agora é posicionamento inicial dos blobs.* >> usar um bubble chart?

2024-05-22

How to detect if a point is inside a shape?

Check if there are other points in the grid cell, then get the closest one and select its blob.

Papers:
- AHeuristicApproachtoValue-DrivenEvaluationofVisualizations

**ANALYSIS**

* Performance analysis
Frame duration x number of particles per blob x number of blobs

* Parameters space Analysis

actual size at rest vs expected size
k x nRT vs R - r

* Stability analysis
after tantas interacoes
k x kd vs vel_media apos tanto de tempo

kd x sd vs vel_media

kd x time_step

all_particles.map(p => p.vel.mod()).reduce( (a,b) => a + b ) / all_particles.length

Limitar quantidade de blobs, jogar demais em "outros".

Escolher interação, empurrando os blobs ou selecionado.


4 chart types, 6 pair-wise comparisons, 2 layouts

24 | 4 x 6 pair-wise comparisons
08 | 4 x 2 extra layouts for one of the pair-wise comparisons (define after pilot study)
12 | 4 x 3 different layouts to identify max, min
01 | rate the visualization methods for your perceived performance in accomplishing these tasks
01 | which method(s) would you prefer

Próximo passo é rodar experimentos com o protótipo.

1. Range of k and nRT to have the blob with the right size.
k = [0.1, ]

Initial placement.

24 | 4 x 6 pair-wise comparisons
? 08 | 4 x 2 extra layouts for one of the pair-wise comparisons (define after pilot study)
12 | 4 x 3 different layouts to identify max, min
12 | 4 x 3 different layouts to order all areas?
01 | rate the visualization methods for your perceived performance in accomplishing these tasks
01 | which method(s) would you prefer

Government vis
Uncertainty visualization




Semana 3-7/6:

* análise do espaço de parâmetros
* ler sobre incerteza em vis, começar com o survey da Jessica Hullman, 
* paper da Lace Padilla
* capitulo daquele handbook da springer sobre evaluation
* line to segment intersection
* procurar algo do Rahul
* paper sobre engagement
* paper open-data
* livro do Ben Jones
* Paper Bostock

# 2024.06.11 

Stability analysis ok! Blob center, R = 150.

```
prototypes % ffmpeg -i first-concept-blob-plot.mp4 -vf scale=600:-1 -pix_fmt rgb24 -r 20 -f gif - | gifsicle --optimize=3 --delay=3 > part1.gif
```

testar estabilidade com diferentes valores de kd.

ok gráficos de estabilidade x ts separados, com vídeos de cada um. talvez implementar um gráfico em tempo real.

testar g = 0.5 e k < 1, P < 2000.

refazer gráfico p x k sem excluir instáveis.

future work: 
* hierarchical data
* stability
* placing algorithms
* what leads people to estimate something as larger than other?

blobs centers

10,978,968
11,223,956
12,463,890
15,723,907
20,934,661
22,608,550
24,272,613
30,886,292

Gráfico que acompanha em tempo real a variação da área, em termos percentuais e

Funcionando legal: 
G = 0.1
nRT = 380
k = 0.86
ts = 0.4

com 
G = 0
nRT = 50
k = 0.74
ts = 0.4

Areas
10 33502.83614689533
11 35425.40798325719
12 39024.191450155166
15 49258.61383507447
20 64279.97996561529
22 70125.79240202055
24 79699.12167055799
30 98347.92338513664

Centers
10 216 518
11 218 1000
12 992 980
15 754 958
20 489 964
22 268 760
24 589 662
30 923 685

Fazer um toggle g = 0, g = 0.1, ajustando nRT e k de acordo.

Plotar gráfico de barras com as áreas no próprio site
montar json com histórico das áreas para plotar no R

Incluir g = 0.5 também, para mostrar como a variação das áreas fica muito maior.


Citar Cleveland, Schneiderman

Eixos 

```js
let axis_x = new Vec(1000,0)
let axis_y = new Vec(0,1000)

axis_x.display(ctx, new Vec(100,100), "black")
axis_y.display(ctx, new Vec(100,100), "black")
```



Stuff in the template:

\section{Template Overview}

This document will \emph{not} explain all the major features of the \verb|acmart| document
class, but will focus on the features of the \verb|timtm| document
class. The \verb|timtm| document
class is purposely similar to the \verb|acmart| document
class, thus facilitating your submitting your report to an ACM conference\footnote{Simply change the document class from timtm to acmart. This sample document conditionally redefines some commands and an environment - so that the features added for a degree project are not included in the resulting document.}. For further information about the details of the \verb|acmart| document
class, see the {\itshape \LaTeX\ User's Guide} --- 
available from \url{https://www.acm.org/publications/proceedings-template}.

The primary parameter given to the document class is
the {\itshape template style} which corresponds to the kind of publication. This parameter is enclosed in square
brackets and is a part of the {\verb|documentclass|} command:
\begin{verbatim}
  \documentclass[STYLE]{timtm}
\end{verbatim}

The styles relevant for a degree project report include:
\begin{itemize}
\item {\verb|sigcconf|}: The majority of ACM's conference proceedings use the {\verb|sigcconf|} template style, as will a degree project report for the Interactive Media Technology (TIMTM) and Media Management (TMMTM) programmes. However, as the class file has been optimized for these two programs, you do not have to give the option: {\verb|sigcconf|}. If you are going to submit to an ACM conference, then you should remove the KTH cover, title, page, DiVA information, Swedish abstract \& keywords, etc. and change to the sigconf document class.
\item {\verb|screen|}: Produces colored hyperlinks.
\item {\verb|review|}: Includes line numbers.
\item {\verb|manuscript|}: Generally used in conjunction with \verb|review| to make it easy for a copy editor to work with your document.
\end{itemize}

A good second step in using the template is to modify the contents of the \texttt{custom\_configuration.tex} file. It contains a number of commands that configure the template as sell as provide meta data that will be needed when your degree project has been successfully completed and your grades are reported in LADOK and the degree project report is archived in DiVA. If you want to understand the motivation for this information and the underlying details of the template see the Overleaf project \url{https://www.overleaf.com/read/qxvttmmqbgdt}. The meta data is collected and appears on a page or pages and the end of the document. These pages will be removed before the report is archived in DiVA.


\section{Title Information}

The title of your work should use capital letters appropriately -
\url{https://capitalizemytitle.com/} has useful rules for
capitalization. Use the {\verb|title|} command to define the title of
your work. If your work has a subtitle, define it with the
{\verb|subtitle|} command.  Do not insert line breaks in your title.

If your title is lengthy, you must define a short version to be used
in the page headers, to prevent overlapping text. The \verb|title|
command has a ``short title'' parameter:
\begin{verbatim}
  \title[short title]{full title}
\end{verbatim}

There are \verb|alttitle| and \verb|altsubtitle| commands so that you can easily specify a Swedish title and optionally a Swedish subtitle for your report. Note that both the thesis title and the Swedish thesis title will subsequently be entered as meta data in DiVA and in LADOK.

\section{CCS Concepts and User-Defined Keywords}

Two elements of the ``acmart'' document class provide powerful
taxonomic tools for you to help readers find your work in an online
search.

The ACM Computing Classification System  (CCS) ---
\url{https://www.acm.org/publications/class-2012} --- is a set of
classifiers and concepts that describe the computing
discipline. Authors can select entries from this classification
system, via \url{https://dl.acm.org/ccs/ccs.cfm}, and generate the
commands to be included in the \LaTeX\ source.

User-defined keywords are a comma-separated list of words and phrases
of the authors' choosing, providing a more flexible way of describing
the research being presented.

There is a \verb|SwedishKeywords| command to make it easy to add keywords in Swedish for your report. These can help make your report visible if someone searches for one or more of these Swedish keywords. You should order them in the same order that you entered the English keywords.

For ACM submissions, CCS concepts and user-defined keywords are required for for all
articles over two pages in length, and are optional for one- and
two-page articles (or abstracts). For degree projects is is very desirable that you provide a suitable set of keywords to help potential readers find your thesis in DiVA.


\section{Tables}

The document class includes the ``\verb|booktabs|''
package --- \url{https://ctan.org/pkg/booktabs} --- for preparing
high-quality tables.

Table captions are placed {\itshape above} the table.

Because tables cannot be split across pages, the best placement for
them is typically the top of the page nearest their initial cite.  To
ensure this proper ``floating'' placement of tables, use the
environment \textbf{table} to enclose the table's contents and the
table caption.  The contents of the table itself must go in the
\textbf{tabular} environment, to be aligned properly in rows and
columns, with the desired horizontal and vertical rules.  Again,
detailed instructions on \textbf{tabular} material are found in the
\textit{\LaTeX\ User's Guide}.

Immediately following this sentence is the point at which
Table~\ref{tab:freq} is included in the input file; compare the
placement of the table here with the table in the printed output of
this document.

\begin{table}
  \caption{Frequency of Special Characters}
  \label{tab:freq}
  \begin{tabular}{ccl}
    \toprule
    Non-English or Math&Frequency&Comments\\
    \midrule
    \O & 1 in 1,000& For Danish, Faroese, and Norwegian names\\
    $\pi$ & 1 in 5& Common in math\\
    \$ & 4 in 5 & Used in business\\
    $\Psi^2_1$ & 1 in 40,000& Unexplained usage\\
  \bottomrule
\end{tabular}
\end{table}

To set a wider table, which takes up the whole width of the page's
live area, use the environment \textbf{table*} to enclose the table's
contents and the table caption.  As with a single-column table, this
wide table will ``float'' to a location deemed more
desirable. Immediately following this sentence is the point at which
Table~\ref{tab:commands} is included in the input file; again, it is
instructive to compare the placement of the table here with the table
in the printed output of this document.

\begin{table*}
  \caption{Some Typical Commands}
  \label{tab:commands}
  \begin{tabular}{ccl}
    \toprule
    Command &A Number & Comments\\
    \midrule
    \texttt{{\char'134}author} & 100& Author \\
    \texttt{{\char'134}table}& 300 & For tables\\
    \texttt{{\char'134}table*}& 400& For wider tables\\
    \bottomrule
  \end{tabular}
\end{table*}

Always use midrule to separate table header rows from data rows, and
use it only for this purpose. This enables assistive technologies to
recognise table headers and support their users in navigating tables
more easily.


\section{Language, Style, and Content}

Spelling and
punctuation may use any dialect of English (e.g., British, Canadian,
US, etc.) provided this is done consistently. Hyphenation is
optional. To ensure suitability for an international audience, please
pay attention to the following:

\begin{itemize}
\item Write in a straightforward style.
\item Try to avoid long or complex sentence structures.
\item Use common and basic vocabulary (e.g., use the word ``unusual'' rather than the word ``arcane''.
\item Briefly define or explain all technical terms that may be
  unfamiliar to readers.
\item Explain all acronyms the first time they are used in your
  text---e.g., ``Digital Signal Processing (DSP)''. You might want to use the package \texttt{glossaries} to help with this.
\item Explain local references (e.g., not everyone knows all city
  names in a particular country).
\item Explain ``insider'' comments. Ensure that your whole audience
  understands any reference whose meaning you do not describe (e.g.,
  do not assume that everyone has used a Macintosh or a particular
  application).
\item Explain colloquial language and puns. Understanding phrases like
  ``red herring'' may require a local knowledge of English.  Humor and
  irony are difficult to translate.
\item Use unambiguous forms for culturally localized concepts, such as
  times, dates, currencies, and numbers (e.g., ``1--5--97'' or
  ``5/1/97'' may mean 5 January or 1 May, and ``seven o'clock'' may
  mean 7:00 am or 19:00). For currencies, indicate equivalences:
  ``Participants were paid {\fontfamily{txr}\selectfont \textwon}
  25,000, or roughly US \$22.''
\item Be careful with the use of gender-specific pronouns (he, she)
  and other gendered words (chairman, manpower, man-months). Use
  inclusive language that is gender-neutral (e.g., she or he, they,
  s/he, chair, staff, staff-hours, person-years). See the
  \textit{Guidelines for Bias-Free Writing} for further advice and
  examples regarding gender and other personal
  attributes~\cite{Schwartz:1995:GBF}. Be particularly aware of
  considerations around writing about people with disabilities.  See also ACM Diversity and Inclusion Council's web page on ``Words Matter: Alternatives for Charged Terminology in the Computing Profession''~\cite{ACMdiversity}.
\item If possible, use the full (extended) alphabetic character set
  for names of persons, institutions, and places (e.g.,
  Gr{\o}nb{\ae}k, Lafreni\'ere, S\'anchez, Nguy{\~{\^{e}}}n,
  Universit{\"a}t, Wei{\ss}enbach, Z{\"u}llighoven, \r{A}rhus, etc.).
  These characters are already included in most versions and variants
  of Times, Helvetica, and Arial fonts.
\end{itemize}
