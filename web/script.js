Promise.all([

    fetch('../base.json').then(response => response.json()),
    fetch('../map-br.json').then(response => response.json())
  
  ]).then( files => {
  
    // dimensões do mapa
    //const w = 600;
    //const h = 600;
  
    // dados dos municipios 
    const data = files[0];
  
    // dados do Brasil
    const br = files[1];
  
    console.log(data, br);
  
    // seleciona o elemento svg em que o mapa será desenhado
    const svg = d3.select('svg.map');
  
    // pega a largura do container do mapa (vai ser necessário para o tooltip)
  
    // capturamos as dimensoes do svg calculadas pelo browser
    const wpx = svg.style('width');
    const hpx = svg.style('height');
    console.log('Dimensões capturadas', wpx,hpx);
  
    // só para remover os "px" das dimensões que capturamos
    const w = +wpx.slice(0,-2);
    const h = +hpx.slice(0,-2);
    console.log('Dimensoes em formato numérico', w, h)
  
    // atualiza variável do css que define a largura do tooltip
    if (w < 600) {
      document.documentElement.style.setProperty('--largura-tt', w / 2 - 10 + 'px');
    }
  
    // define os atributos do svg com base nessas dimensões
    svg.attr('width', w);
    svg.attr('height', h);
    svg.attr('viewBox', `0 0 ${w} ${h}`)
  
    // uma margenzinha para o mapa
    const pad = 10;
  
    // o segundo arquivo, que armazenamos na variável "br" é só um polígono do Brasil inteiro, para ser usado para centralizar e definir a escala ideal da projeção do mapa
    // define a projeção, com base nas dimensões desejadas, e usa o polígono mencionado acima para posicionar o mapa automaticamente dentro das dimensões desejadas
    // (para evitar o pesadelo de usar .center().translate().scale() )
    const proj = d3.geoMercator()
      .fitExtent([[pad, pad], [w - pad, h - pad]], br)
    ;
  
    // define a função que vai converter as coordenadas lat/lon dos polígonos em coordenadas de desenho do SVG
    const gerador_path = d3.geoPath().projection(proj);
  
    // cria os elementos path para cada municipio presente nos dados
    const municipios = svg
            .selectAll("circle.municipio") // esse é o padrao do D3, precisa começar com uma seleção, ainda que vazia, já que ainda não existe nenhum elemento "path"
            .data(data.features) // aqui definimos de onde vêm os dados que serão associados aos elementos "path" que serão criados
            .join("path") // na prática, este comando cria um elemento "path" para elemento na lista de dados (ou seja, para cada linha do dataframe)
            .classed('municipio', true) // acrescentamos uma classe aos elementos criados, para ficar mais fácil fazer referências a eles depois
            .attr("d", gerador_path) // o principal atributo do elemento "path" de um svg é o atributo "d", que são como instruções de desenhos ("mova o cursor para o ponto (x,y), desenhe uma linha até o ponto (x1,y1)" etc.) esse atributo vai ser gerado pela função "gerador_path" que definimos acima, convertendo as coordenadas geográficas presentes em cada linha do dataframe (ou elemento da lista de dados), em instruções de desenho
            .attr("fill", d => escala_cor(d.properties[`qde_${tipo_grafico}s`]))
    ;