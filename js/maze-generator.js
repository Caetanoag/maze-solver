import { LINHAS, COLUNAS, LADO_QUADRADO, PORCENTAGEM } from "./vars.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = LADO_QUADRADO*COLUNAS*1.2;
canvas.height = LADO_QUADRADO*LINHAS*1.2;
const LADO = LADO_QUADRADO;
const PERCENTUAL = PORCENTAGEM;

const grade = [];
for (let quantidade = 0; quantidade < LINHAS * COLUNAS; quantidade++) {
	grade.push({
		visitada: false,
		paredes: [true, true, true, true], //norte, leste, sul, oeste
	});
}

const pilha = [];
let celula = 0;
grade[celula].visitada = true;
for (let quantidade = 1; quantidade < LINHAS * COLUNAS; ) {
	const vizinhos = [];
	for (let direcao = 0; direcao < 4; direcao++) {
		const x = (celula % COLUNAS) + (direcao % 2) * (2 - direcao);
		const y = Math.floor(celula / COLUNAS) + ((direcao + 1) % 2) * (direcao - 1);
		if (x >= 0 && x < COLUNAS && y >= 0 && y < LINHAS) {
			const vizinho = y * COLUNAS + x;
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
			(diferenca - (diferenca % COLUNAS)) / COLUNAS +
			(diferenca % COLUNAS) ** 2 -
			(diferenca % COLUNAS);
		grade[celula].paredes[direcao] = grade[vizinho].paredes[(direcao + 2) % 4] =
			false;
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
	let quantidade = PERCENTUAL * LINHAS * COLUNAS;
	quantidade > 0;
	quantidade--
) {
	const celula = Math.floor(Math.random() * LINHAS * COLUNAS);
	const direcao = Math.floor(Math.random() * 4);
	const x = (celula % COLUNAS) + (direcao % 2) * (2 - direcao);
	const y = Math.floor(celula / COLUNAS) + ((direcao + 1) % 2) * (direcao - 1);
	if (x >= 0 && x < COLUNAS && y >= 0 && y < LINHAS) {
		grade[celula].paredes[direcao] = grade[y * COLUNAS + x].paredes[
			(direcao + 2) % 4
		] = Math.floor(Math.random() * 2);
	}
}

function desenharLinha(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1 + 1, y1 + 1);
	ctx.lineTo(x2 + 1, y2 + 1);
	ctx.stroke();
}

ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "black";
for (let celula = 0; celula < LINHAS * COLUNAS; celula++) {
	const x = celula % COLUNAS;
	const y = Math.floor(celula / COLUNAS);
	if (grade[celula].paredes[0]) {
		desenharLinha(x * LADO, y * LADO, x * LADO + LADO, y * LADO);
	}
	if (grade[celula].paredes[1]) {
		desenharLinha(x * LADO + LADO, y * LADO, x * LADO + LADO, y * LADO + LADO);
	}
	if (grade[celula].paredes[2]) {
		desenharLinha(x * LADO + LADO, y * LADO + LADO, x * LADO, y * LADO + LADO);
	}
	if (grade[celula].paredes[3]) {
		desenharLinha(x * LADO, y * LADO + LADO, x * LADO, y * LADO);
	}
}
