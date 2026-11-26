export const COLUNAS = parseInt(prompt("Insira a quantidade de colunas: "), 10);
export const LINHAS = parseInt(prompt("Insira a quantidade de linhas: "), 10);
export const LADO_QUADRADO = parseInt(prompt("Insira o tamanho do pixel"), 10);
export const PORCENTAGEM = Math.max(
	0,
	Math.min(
		parseFloat(prompt("Insira o percentual de novos caminhos (0-1):")),
		1,
	),
);
