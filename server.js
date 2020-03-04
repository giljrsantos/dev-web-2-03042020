const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const fs = require('fs');

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render('index');
});


//ROTA PARA MOSTRAR 
 app.get('/txt', function(req, res) {

    var arrCount = [];   //array de armazenamento e contagem de palavras

    lerArquivo();
    
    function lerArquivo(){  //recebe o arquivo como input
       var data = fs.readFileSync('biblia.txt','utf8'); //english version
       //var data = fs.readFileSync('./input/biblia-pt-br.txt','utf8');  //portuguese version
       regexData(data);
    }
    
    function regexData(data) { //trata o array recebido
       const elemArray = Array.from(data.split(/\s+/));   //faz um split nas palavras, por espaço e armazena em um array
       var regex = /[/,:;.?*!-]\s+|\s+/g; //regex para remover pontos e vírgulas
    
       elemArray.forEach(element => {   //função que percorre cada elemento do array      
          if (element.length >= 4)   //continua somente se a palavra tiver mais que 3 caracteres
             var elem = (element.replace(regex, '')).toLowerCase();   //aplica o regex e lowercase no elemento
             commonWords(elem);   
       });   
    
       topWords();
    }
    
    function commonWords(elem) {  //função para adicionar ou incrementar elemento
       let elemIndex = arrCount.findIndex(Elem => Elem.nome === elem); //busca o index do elemento no array
       
       if(elemIndex != -1) {      // != -1: existe no array 
          scoreWord(elemIndex);
       } else {                   // não existe no array 
          insertWord(elem);
       }
    }
    
    function insertWord(elemName) {  //insere o elemento no array
       arrCount.push({nome:elemName, qtd:1});
    }
    
    function scoreWord(elemIndex) {  //incrementa a quantidade do elemento
       if(arrCount[elemIndex].nome != null)
          arrCount[elemIndex].qtd += 1;
    }
    
    function topWords() {
       let topValues = arrCount.slice(0);
       topValues.sort(function(a,b) {
          return b.qtd - a.qtd;
       });
    
       generateChart(topValues.slice(0,10));
       //console.log(topValues);
    }
    
     function generateChart(topValues) {
       var data = [{
          x:[topValues[0].nome,topValues[1].nome,topValues[2].nome,topValues[3].nome,topValues[4].nome,topValues[5].nome,topValues[6].nome,topValues[7].nome,topValues[8].nome,topValues[9].nome],
          y:[topValues[0].qtd,topValues[1].qtd,topValues[2].qtd,topValues[3].qtd,topValues[4].qtd,topValues[5].qtd,topValues[6].qtd,topValues[7].qtd,topValues[8].qtd,topValues[9].qtd],
          type: 'bar'}];
    
       console.log(topValues);
       res.render('txt', {topValues : topValues});
       //res.json({ topValues: topValues});
       //res.write(topValues);
     
  
    } 
    
     
    /* fs.readFile('biblia.txt', 'utf-8', function(err, data) {
        var palavras = data.split(/[/,:;.?*!-]\s+|\s+/g); //separa as palavras usando pelo o espaço

        var linha = data.split(/\r?\n/); //separa as linhas
        var totalrepeticao = (data.match(/Lord/gi) || []).length; //verifica quantas vezes a palavra é repetida
        console.log("Total Linha: " + linha.length);
        console.log("Total Palavras: " + palavras.length);
        console.log("Total Repetição: " + totalrepeticao);
        res.write(data);
        res.end();
    }); */
}); 
 
/* fs.readFile('biblia.txt', 'utf-8', function(err, data) {
    var linha = data.split(/\r?\n/);
    linha.forEach(function(linha){
        console.log(linha);        
    });
    console.log(linha.length);
}) */

app.listen(8080, function() {
  console.log('App de Exemplo escutando na porta 8080!');
});