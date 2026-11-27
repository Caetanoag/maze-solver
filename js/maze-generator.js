import { config } from "./vars.js";
import { dijkstra, desenharCaminho } from "./resolver.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

function desenharLinha(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1 + 1, y1 + 1);
	ctx.lineTo(x2 + 1, y2 + 1);
	ctx.stroke();
}

export function gerarLabirinto() {
	canvas.width = config.LADO_QUADRADO * config.COLUNAS * 1.2;
	canvas.height = config.LADO_QUADRADO * config.LINHAS * 1.2;
	const LADO = config.LADO_QUADRADO;
	const PERCENTUAL = config.PORCENTAGEM;

	const grade = [];
	for (
		let quantidade = 0;
		quantidade < config.LINHAS * config.COLUNAS;
		quantidade++
	) {
		grade.push({
			visitada: false,
			paredes: [true, true, true, true], // norte, leste, sul, oeste
		});
	}

	const pilha = [];
	let celula = 0;
	grade[celula].visitada = true;
	for (let quantidade = 1; quantidade < config.LINHAS * config.COLUNAS; ) {
		const vizinhos = [];
		for (let direcao = 0; direcao < 4; direcao++) {
			const x = (celula % config.COLUNAS) + (direcao % 2) * (2 - direcao);
			const y =
				Math.floor(celula / config.COLUNAS) +
				((direcao + 1) % 2) * (direcao - 1);
			if (x >= 0 && x < config.COLUNAS && y >= 0 && y < config.LINHAS) {
				const vizinho = y * config.COLUNAS + x;
				if (!grade[vizinho].visitada) {
					vizinhos.push(vizinho);
				}
			}
		}
		if (vizinhos.length > 0) {
			pilha.push(celula);
			const vizinho = vizinhos[Math.floor(Math.random() * vizinhos.length)];
			const diferenca = vizinho - celula;
			const direcao =
				1 +
				(diferenca - (diferenca % config.COLUNAS)) / config.COLUNAS +
				(diferenca % config.COLUNAS) ** 2 -
				(diferenca % config.COLUNAS);
			grade[celula].paredes[direcao] = grade[vizinho].paredes[
				(direcao + 2) % 4
			] = false;
			celula = vizinho;
			grade[celula].visitada = true;
			quantidade++;
		} else {
			if (pilha.length > 0) {
				celula = pilha.pop();
			}
		}
	}

	for (
		let quantidade = PERCENTUAL * config.LINHAS * config.COLUNAS;
		quantidade > 0;
		quantidade--
	) {
		const celula = Math.floor(Math.random() * config.LINHAS * config.COLUNAS);
		const direcao = Math.floor(Math.random() * 4);
		const x = (celula % config.COLUNAS) + (direcao % 2) * (2 - direcao);
		const y =
			Math.floor(celula / config.COLUNAS) + ((direcao + 1) % 2) * (direcao - 1);
		if (x >= 0 && x < config.COLUNAS && y >= 0 && y < config.LINHAS) {
			grade[celula].paredes[direcao] = false;
			grade[y * config.COLUNAS + x].paredes[(direcao + 2) % 4] = false;
		}
	}

	const bordas = [];
	for (let i = 0; i < config.LINHAS * config.COLUNAS; i++) {
		const x = i % config.COLUNAS;
		const y = Math.floor(i / config.COLUNAS);
		if (
			x === 0 ||
			x === config.COLUNAS - 1 ||
			y === 0 ||
			y === config.LINHAS - 1
		) {
			bordas.push(i);
		}
	}

	const INICIO = bordas[Math.floor(Math.random() * bordas.length)];
	const distMinima = Math.floor((config.LINHAS + config.COLUNAS) / 2);

	let FIM;
	do {
		FIM = bordas[Math.floor(Math.random() * bordas.length)];
		const dist =
			Math.abs((INICIO % config.COLUNAS) - (FIM % config.COLUNAS)) +
			Math.abs(
				Math.floor(INICIO / config.COLUNAS) - Math.floor(FIM / config.COLUNAS),
			);
		if (dist >= distMinima) break;
	// biome-ignore lint/correctness/noConstantCondition: <explanation>
	} while (true);

	for (const cel of [INICIO, FIM]) {
		const x = cel % config.COLUNAS;
		const y = Math.floor(cel / config.COLUNAS);
		if (y === 0) grade[cel].paredes[0] = false;
		else if (x === config.COLUNAS - 1) grade[cel].paredes[1] = false;
		else if (y === config.LINHAS - 1) grade[cel].paredes[2] = false;
		else if (x === 0) grade[cel].paredes[3] = false;
	}

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "black";
	for (let celula = 0; celula < config.LINHAS * config.COLUNAS; celula++) {
		const x = celula % config.COLUNAS;
		const y = Math.floor(celula / config.COLUNAS);
		if (grade[celula].paredes[0]) {
			desenharLinha(x * LADO, y * LADO, x * LADO + LADO, y * LADO);
		}
		if (grade[celula].paredes[1]) {
			desenharLinha(
				x * LADO + LADO,
				y * LADO,
				x * LADO + LADO,
				y * LADO + LADO,
			);
		}
		if (grade[celula].paredes[2]) {
			desenharLinha(
				x * LADO + LADO,
				y * LADO + LADO,
				x * LADO,
				y * LADO + LADO,
			);
		}
		if (grade[celula].paredes[3]) {
			desenharLinha(x * LADO, y * LADO + LADO, x * LADO, y * LADO);
		}
	}

	const resultado = dijkstra(grade, config.LINHAS, config.COLUNAS, INICIO, FIM);

	if (resultado.custo === Infinity) {
		console.log("Não existe caminho entre o início e o fim.");
	} else {
		console.log(`Menor custo: ${resultado.custo}`);
		console.log(`Células no caminho: ${resultado.caminho.length}`);
		desenharCaminho(ctx, resultado.caminho, config.COLUNAS, LADO);
	}
}
