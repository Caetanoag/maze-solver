//heap é um array de [prioridade, item], ele pega rapidamente o menor ou o maior elemento de um array, mesmo com inserções constantes

//insere um item no heap e depois reorganiza o array, pois
function heapInserir(heap, item, prioridade) { //heap == array; item == número da célula; prioridade == ordena a distância
	heap.push([prioridade, item]); //célula tal com distância tal no fim do labirinto
	let i = heap.length - 1;
	while (i > 0) { //enqunto não ir pro ínicio
		const pai = (i - 1) >> 1;
		if (heap[pai][0] <= heap[i][0]) break;
		[heap[pai], heap[i]] = [heap[i], heap[pai]];
		i = pai;
	}
}

function heapRemover(heap) {
	const topo = heap[0];
	const ultimo = heap.pop();
	if (heap.length > 0) {
		heap[0] = ultimo;
		let i = 0;
		while (true) {
			const esq = 2 * i + 1;
			const dir = 2 * i + 2;
			let menor = i;
			if (esq < heap.length && heap[esq][0] < heap[menor][0]) menor = esq;
			if (dir < heap.length && heap[dir][0] < heap[menor][0]) menor = dir;
			if (menor === i) break;
			[heap[menor], heap[i]] = [heap[i], heap[menor]];
			i = menor;
		}
	}
	return topo;
}

// Custo de se mover para uma célula
function custoMovimento() {
	return 1;
}


export function dijkstra(grade, linhas, colunas, inicio, fim) {
	const total = linhas * colunas;
	const distancia = new Array(total).fill(Infinity);
	const anterior = new Array(total).fill(-1);
	const fila = [];

	distancia[inicio] = 0;
	heapInserir(fila, inicio, 0);

	while (fila.length > 0) {
		const [prioridade, atual] = heapRemover(fila);

		if (prioridade > distancia[atual]) continue; // entrada desatualizada
		if (atual === fim) break;

		for (let direcao = 0; direcao < 4; direcao++) {
			if (grade[atual].paredes[direcao]) continue; // parede bloqueando

			const x = (atual % colunas) + (direcao % 2) * (2 - direcao);
			const y = Math.floor(atual / colunas) + ((direcao + 1) % 2) * (direcao - 1);
			if (x < 0 || x >= colunas || y < 0 || y >= linhas) continue;

			const vizinho = y * colunas + x;
			const novaDistancia = distancia[atual] + custoMovimento(atual, vizinho);

			if (novaDistancia < distancia[vizinho]) {
				distancia[vizinho] = novaDistancia;
				anterior[vizinho] = atual;
				heapInserir(fila, vizinho, novaDistancia);
			}
		}
	}

	// Reconstrói o caminho
	const caminho = [];
	if (distancia[fim] !== Infinity) {
		for (let c = fim; c !== -1; c = anterior[c]) caminho.push(c);
		caminho.reverse();
	}

	return { custo: distancia[fim], caminho };
}


export function desenharCaminho(ctx, caminho, colunas, lado) {
	if (caminho.length === 0) return;

	const centro = (celula) => ({
		x: (celula % colunas) * lado + lado / 2 + 1,
		y: Math.floor(celula / colunas) * lado + lado / 2 + 1,
	});

	ctx.strokeStyle = "red";
	ctx.lineWidth = 2;
	ctx.beginPath();
	caminho.forEach((celula, i) => {
		const { x, y } = centro(celula);
		if (i === 0) ctx.moveTo(x, y);
		else ctx.lineTo(x, y);
	});
	ctx.stroke();

	// início (verde) e fim (azul)
	const marcar = (celula, cor) => {
		const { x, y } = centro(celula);
		ctx.fillStyle = cor;
		ctx.beginPath();
		ctx.arc(x, y, lado / 4, 0, Math.PI * 2);
		ctx.fill();
	};
	marcar(caminho[0], "green");
	marcar(caminho[caminho.length - 1], "blue");

	ctx.lineWidth = 1;
	ctx.strokeStyle = "black";
}