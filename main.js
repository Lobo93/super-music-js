// Variáveis
let listaDeMusicas
let musicaEscolhida = 0
let corDeFundo = '#211'
let tela = ''
let telaPreta = true
let opacidadeTelaPreta = 1
let tempoAnterior = 0
let tempoDelta = 0
let tempoMusica = 0
let tocando = false
let posicaoPista = 0
let velocidadePista = 200
let larguraPista = 200
let alturaPista = 400
let posicaoBase = 360
let margemDeErro = 0.1
let musica = new Audio
let somErro = new Audio('sons/erro.wav')
let notasSeguidas = 0
let multiplicador = 1
let ledsMultiplicador = 0
let pontos = 0
let porcentagem = 0
let bases = []
let notas = []
let fogos = []
let teclas = {
	'Digit1': [0,false],
	'Digit2': [1,false],
	'Digit9': [2,false],
	'Digit0': [3,false]
}

// Folha de sprites
const folhaDeSprites = {
	fonte: new Image,
	pista: [0,0,200,200],
	fundo: [0,204,200,200],
	nota0: [204,0,64,32],
	nota1: [204,36,64,32],
	nota2: [204,72,64,32],
	nota3: [204,108,64,32],
	base0: [204,144,64,32],
	base1: [204,180,64,32],
	base2: [204,216,64,32],
	base3: [204,252,64,32],
	base4: [204,360,64,32],
	barra0: [40,408,8,16],
	barra1: [52,408,8,16],
	barra2: [64,408,8,16],
	barra3: [76,408,8,16],
	fogo0: [204,288,64,64],
	fogo1: [204,356,64,64],
	led0: [0,408,16,16],
	led1: [20,408,16,16]
}

// Carregar arquivos necessários
async function carregarArquivos() {
	// Fonte
	const fonte = new FontFace ('grunger','url(fontes/Grunger.ttf)');
	await fonte.load()
	document.fonts.add(fonte)

	// Imagens
	const imagem = new Image
	imagem.src = 'imagens/folha-de-sprites.png'
	await imagem.decode()
	folhaDeSprites.fonte = imagem

	// Lista de músicas
	const musicasDados = await fetch('lista.txt')
	const musicasTexto = await musicasDados.text()
	listaDeMusicas = musicasTexto.split('\n')

	// Fim do carregamento
	telaInicial()
}
window.addEventListener('load', carregarArquivos)

// Canvas
const contexto = canvas.getContext('2d')

// Textos
function texto(texto, x=0, y=0, tamanho = 24, cor = '#eee') {
	contexto.textAlign = 'center'
	contexto.font = `${tamanho}px grunger`
	contexto.fillStyle = cor
	contexto.fillText(texto, x, y)
}

// Título
function desenharTitulo() {
	// Título
	texto('Super Music JS!', 200, 40, 40, '#eee')

	// Subtítulo
	texto('Feito pelo Lobo ♥', 286, 70, 16, '#a24')
}

// Tela incial
function telaInicial() {
	telaPreta = false
	tela = 'inicial'
}
function eventosTelaInicial() {
	desenharTitulo()

	// Texto
	const opacidade = (Math.abs(Date.now() % 500 - 250) + 250) / 500
	texto('Começar!', 200, 220, 24, `rgba(221,221,221,${opacidade})`)
}
window.addEventListener('click', () => {
	if (tela === 'inicial') telaSelecao()
})
window.addEventListener('keydown', ({code,repeat}) => {
	if (tela !== 'inicial') return
	if (repeat) return
	if (code !== 'Space' && code !== 'Enter') return
	setTimeout(telaSelecao, 10)
})

// Tela de seleção de música
function telaSelecao() {
	telaPreta = false
	botoesMusica.classList.remove('inativo')
	tela = 'selecao'
	musica.src = `musicas/${listaDeMusicas[musicaEscolhida]}/musica.mp3`
	musica.volume = 0.2
	musica.play()
}
function eventosTelaSelecao() {
	desenharTitulo()

	// Texto 'Escolha uma música'
	texto('Escolha uma música', 200, 180)

	// Lista de músicas
	const opacidade = (Math.abs(Date.now() % 500 - 250) + 250) / 500
	texto(listaDeMusicas[musicaEscolhida], 200, 280, 24, `rgba(221,221,221,${opacidade})`)

	if (musicaEscolhida > 0) {
		texto(listaDeMusicas[musicaEscolhida-1], 200, 250, 16, '#eee4')
		texto('▲', 200, 230)
	}
	if (musicaEscolhida < listaDeMusicas.length - 1) {
		texto(listaDeMusicas[musicaEscolhida+1], 200, 305, 16, '#eee4')
		texto('▼', 200, 330)
	}
}

// Escolher música
function musicaAnterior() {
	if (botoesMusica.classList.contains('inativo')) return
	if (musicaEscolhida <= 0) return
	musicaEscolhida--
	musica.pause()
	musica.src = `musicas/${listaDeMusicas[musicaEscolhida]}/musica.mp3`
	musica.volume = 0.2
	musica.play()
}
function proximaMusica() {
	if (botoesMusica.classList.contains('inativo')) return
	if (musicaEscolhida >= listaDeMusicas.length - 1) return
	musicaEscolhida++
	musica.pause()
	musica.src = `musicas/${listaDeMusicas[musicaEscolhida]}/musica.mp3`
	musica.volume = 0.2
	musica.play()
}
window.addEventListener('keydown', ({code}) => {
	if (tela !== 'selecao') return
	if (code === 'ArrowUp') musicaAnterior()
	if (code === 'ArrowDown') proximaMusica()
})
window.addEventListener('wheel', ({deltaY}) => {
	if (deltaY < 0) musicaAnterior()
	if (deltaY > 0) proximaMusica()
})
botaoProximaMusica.addEventListener('click', proximaMusica)
botaoMusicaAnterior.addEventListener('click', musicaAnterior)

function escolherMusica() {
	if (botoesMusica.classList.contains('inativo')) return
	botoesMusica.classList.add('inativo')
	musica.pause()
	telaPreta = true
	setTimeout(telaJogo, 1000)
}
window.addEventListener('keydown', ({code,repeat}) => {
	if (tela !== 'selecao') return
	if (repeat) return
	if (code !== 'Space' && code !== 'Enter') return
	escolherMusica()
})
botaoMusica.addEventListener('click', escolherMusica)

// Bases
class Base {
	constructor(posicao) {
		this.posicao = posicao,
		this.escala = 1,
		this.ativa = false
		this.fogo = 0
	}
}
for (let i = 0; i < 4; i++) bases.push(new Base(i))

// Notas
class Nota {
	constructor(posicao,tempo,duracao = 0) {
		this.posicao = posicao,
		this.tempo = tempo,
		this.duracao = duracao,
		this.tamanhoBarra = this.duracao
		this.tocada = false
		this.passada = false
		this.opacidadeBarra = 1
	}
}

// multiplicador
function atualizarMultiplicador() {
	multiplicador = Math.min(Math.floor(notasSeguidas / 10) + 1, 4)
	ledsMultiplicador = notasSeguidas >= 30 ? 10 : notasSeguidas % 10
}

// Ativar bases
function ativarBase(posicao) {
	if (botoesNota.classList.contains('inativo')) return
	bases[posicao].ativa = true
	const nota = notas.find(nota => !nota.tocada && !nota.passada && nota.posicao === posicao && Math.abs(nota.tempo - tempoMusica) <= margemDeErro)
	if (!nota) {
		erro()
		return
	}
	notasSeguidas++
	atualizarMultiplicador()
	pontos += 100 * multiplicador
	nota.tocada = true
	bases[posicao].fogo = 1
}
window.addEventListener('keydown', ({code}) => {
	if (!(code in teclas)) return
	if (teclas[code][1]) return
	ativarBase(teclas[code][0])
	teclas[code][1] = true
})
botoesNota.addEventListener('touchstart', ({target}) => {
	if (!target.dataset.posicao) return
	ativarBase(Number(target.dataset.posicao))
})

// Soltar bases
function soltarBase(posicao) {
	bases[posicao].ativa = false
	let nota = notas.find(nota => !nota.passada && nota.tocada && nota.posicao === posicao)
	if (nota) nota.passada = true 
}
window.addEventListener('keyup', ({code}) => {
	if (!(code in teclas)) return
	soltarBase(teclas[code][0])
	teclas[code][1] = false
})
botoesNota.addEventListener('touchend', ({target}) => {
	if (!target.dataset.posicao) return
	soltarBase(Number(target.dataset.posicao))
})

// Carregar música
async function carregarMusica(nomeMusica) {
	// Carregar notas
	const dadosNotas = await fetch(`musicas/${nomeMusica}/notas.txt`)
	const textoNotas = await dadosNotas.text()
	notas = textoNotas
	.split('\n')
	.filter(nota => nota)
	.map(nota => new Nota(...nota.split(',').map(valor => Number(valor))))
	.sort((nota1,nota2) => nota1.tempo - nota2.tempo)

	// Caregar audio
	const dadosSilencio = await fetch('sons/silencio.mp3')
	const dadosMusica = await fetch(`musicas/${nomeMusica}/musica.mp3`)
	const blobSilencio = await dadosSilencio.blob()
	const blobMusica = await dadosMusica.blob()
	let blob = new Blob([blobSilencio, blobMusica])
	audio = URL.createObjectURL(blob)

	telaPreta = false
	musica.src = audio
	musica.volume = 0.5
	musica.play()
	tocando = true
}

// Tela do jogo
const canvasPista = document.createElement('canvas')
const contextoPista = canvasPista.getContext('2d')
canvasPista.width = larguraPista
canvasPista.height = alturaPista

function telaJogo() {
	botoesNota.classList.remove('inativo')
	multiplicador = 1
	notasSeguidas = 0
	pontos = 0
	tela = 'jogo'
	carregarMusica(listaDeMusicas[musicaEscolhida])
}
function eventosTelaJogo() {
	// Atualizar tempo de música
	tempoMusica = musica.currentTime - 2

	// Limpar pista
	contextoPista.clearRect(0,0,larguraPista,alturaPista)

	// Desenhar imagem de fundo da pista
	contextoPista.drawImage(folhaDeSprites.fonte, ...folhaDeSprites.pista, 0, -alturaPista + posicaoPista, larguraPista, alturaPista)
	contextoPista.drawImage(folhaDeSprites.fonte, ...folhaDeSprites.pista, 0, posicaoPista, larguraPista, alturaPista)

	// Verificar notas que já passaram do tempo
	notas.forEach(nota => {
		if (!nota.passada && !nota.tocada && nota.tempo < tempoMusica && Math.abs(nota.tempo - tempoMusica) > margemDeErro) {
			nota.passada = true
			erro()
		}
	})

	// Desenhar barras das notas
	notas.forEach(nota => {
		if (nota.duracao <= 0) return
		if (nota.opacidadeBarra <= 0) return
		if (nota.tempo > tempoMusica + posicaoBase/velocidadePista) return // Barra antes da pista
		if (nota.tempo + nota.duracao < tempoMusica - (alturaPista-posicaoBase)/velocidadePista) return // Barra depois da pista
		if (nota.tocada) nota.tamanhoBarra =  Math.max(nota.duracao - Math.max(tempoMusica - nota.tempo, 0), 0)
		if (nota.passada) nota.opacidadeBarra = Math.max(nota.opacidadeBarra - tempoDelta * 10, 0)
		const largura = 8
		contextoPista.save()
		contextoPista.globalAlpha = nota.opacidadeBarra
		contextoPista.drawImage(
			folhaDeSprites.fonte,
			...folhaDeSprites[`barra${nota.posicao}`],
			nota.posicao * 50 + 25 - largura / 2,
			posicaoBase - nota.duracao * velocidadePista / musica.playbackRate  + (tempoMusica - nota.tempo) * velocidadePista / musica.playbackRate,
			largura,
			nota.tamanhoBarra * velocidadePista / musica.playbackRate
		)
		contextoPista.restore()
	})

	// Desenhar bases
	bases.forEach(base => {
		const largura = 44
		const altura = 22
		if (base.ativa) {
			base.escala = 1.2
			const nota = notas.find(nota => nota.tocada && !nota.passada && nota.posicao === base.posicao && nota.tempo + nota.duracao > tempoMusica)
			if (!nota) soltarBase(base.posicao)
		}
		else if (base.escala > 1) base.escala = (Math.max(1, base.escala - tempoDelta))
		contextoPista.drawImage(
			folhaDeSprites.fonte,
			...folhaDeSprites[`base${base.posicao}`],
			base.posicao * 50 + 25 - largura * base.escala / 2,
			posicaoBase - altura * base.escala / 2,
			largura * base.escala,
			altura * base.escala
		)
	})

	// Desenhar notas
	notas.forEach(nota => {
		if (nota.tocada) return

		const largura = 40
		const altura = 20
	
		if (nota.tempo > tempoMusica + posicaoBase/velocidadePista) return // Nota antes da pista
		if (nota.tempo < tempoMusica - (alturaPista-posicaoBase+altura)/velocidadePista) return // Nota depois da pista
	
		contextoPista.drawImage(
			folhaDeSprites.fonte,
			...folhaDeSprites[`nota${nota.posicao}`],
			nota.posicao * 50 + 25 - largura / 2,
			posicaoBase - altura / 2 + (tempoMusica - nota.tempo) * velocidadePista / musica.playbackRate,
			largura,
			altura
		)
	})

	// Somar pontos de notas longas
	notas.forEach(nota => {
		if (nota.tocada && !nota.passada && nota.duracao > 0) pontos += tempoDelta * 100 * multiplicador
	})

	// Desenhar pista no canvas principal	
	for (let i = 0; i < canvasPista.height; i++) {
		const interpolacao = i ** 2 * 0.0015
		contexto.drawImage(
			canvasPista,
			0, i, canvasPista.width, 1,
			150 - interpolacao / 2, 100 + interpolacao * 1.25, 100 + interpolacao, interpolacao ** 2 * 0.0025
		)
	}

	// Desenhar fogo
	bases.forEach(base => {
		const largura = 80
		const altura = 80
		if (base.ativa) base.fogo = 1
		else base.fogo = Math.max(base.fogo - tempoDelta, 0)
		if (base.fogo <= 0.5) return
		const imagem = Math.abs(Math.floor(tempoMusica * 20) % 2)
		contexto.save()
		contexto.globalAlpha = base.fogo ** 5
		contexto.drawImage(
			folhaDeSprites.fonte,
			...folhaDeSprites[`fogo${imagem}`],
			base.posicao * 74 + 37 + 50 - largura * base.fogo / 2,
			350 - altura * base.fogo ** 2,
			largura * base.fogo,
			altura * base.fogo ** 2
		)
		contexto.restore()
	})

	// Desenhar pontos
	texto(Math.floor(pontos), 200, 40)

	// Desenhar multiplicador
	texto(`x ${multiplicador}`, 54, 110, 40)
	for (let i = 0; i < 10; i++) {
		const led = ledsMultiplicador <= i ? 'led0' : 'led1'
		contexto.drawImage(folhaDeSprites.fonte, ...folhaDeSprites[led], i * 10 + 10, 64, 10, 10)
	}

	// Normalizar volume
	if (musica.volume < 0.5) musica.volume = Math.min(musica.volume + tempoDelta, 0.5)

	// Atualizar posição da pista
	posicaoPista += tempoDelta * velocidadePista
	posicaoPista %= alturaPista
}
function erro() {
	notasSeguidas = 0
	atualizarMultiplicador()
	somErro.currentTime = 0
	somErro.play()
	musica.volume = 0.05
}
musica.addEventListener('ended', () => {
	if (tela !== 'jogo') return
	botoesNota.classList.add('inativo')
	telaPreta = true
	porcentagem = Math.floor(notas.filter(nota => nota.tocada).length / notas.length * 100)
	setTimeout(telaFinal, 500)
})

// Tela final
function telaFinal() {
	telaPreta = false
	tela = 'final'
	botaoVoltar.classList.remove('inativo')
}
function eventosTelaFinal() {
	contexto.fillStyle = '#ddd'
	contexto.font = '24px grunger'

	// Nome da música
	texto(listaDeMusicas[musicaEscolhida], 200, 40)

	// Pontos
	texto(`${Math.floor(pontos)} pontos`, 200, 130)

	// Porcentagem de acertos
	texto(`${porcentagem}%`, 200, 180, 40)

	// Mensagem
	if (porcentagem >= 100) texto('Você é fera!!!', 200, 240, 40, '#a24')
	else if (porcentagem > 95) texto('Mandou bem!!!', 200, 240, 32)
	else if (porcentagem > 80) texto('Muito bom!', 200, 240, 32)

	// Botão voltar
	const opacidade = (Math.abs(Date.now() % 500 - 250) + 250) / 500
	texto('< Voltar', 70, 380, 24, `rgba(221,221,221,${opacidade})`)
}
function voltar() {
	if (botaoVoltar.classList.contains('inativo')) return
	botaoVoltar.classList.add('inativo')
	telaPreta = true
	setTimeout(telaSelecao, 500)
}
botaoVoltar.addEventListener('click', voltar)
window.addEventListener('keydown', ({code,repeat}) => {
	if (tela !== 'final') return
	if (repeat) return
	if (code !== 'Space' && code !== 'Enter') return
	voltar()
})

// Repetir frame
function frame(tempoAtual) {
	// Tempo delta (tempo decorrido desde o último frame)
	tempoDelta = (tempoAtual - tempoAnterior) * 0.001
	tempoAnterior = tempoAtual

	// Imagem de fundo
	contexto.drawImage(folhaDeSprites.fonte, ...folhaDeSprites.fundo, 0, 0, canvas.width, canvas.height)

	// Tela inicial
	if (tela === 'inicial') eventosTelaInicial()
	// Tela de seleção de músicas
	if (tela === 'selecao') eventosTelaSelecao()
	// Tela de jogo
	if (tela === 'jogo') eventosTelaJogo()
	// Tela final
	if (tela === 'final') eventosTelaFinal()

	// Efeito de tela preta
	opacidadeTelaPreta = telaPreta ?
	Math.min(opacidadeTelaPreta + tempoDelta * 5, 1) :
	Math.max(opacidadeTelaPreta - tempoDelta * 5, 0)

	if (opacidadeTelaPreta > 0) {
		contexto.fillStyle = `rgba(17,17,17,${opacidadeTelaPreta})`
		contexto.fillRect(0,0,canvas.width,canvas.height)
	}
	
	// Chamar próximo frame
	window.requestAnimationFrame(frame)
}

// Primeiro frame
window.requestAnimationFrame(frame)

// Marcar o tempo das notas
let notasTempo = []
window.addEventListener('keydown', ({code,repeat}) => {
	if (repeat) return
	if (code === 'Space') notasTempo.push(tempoMusica)
})
