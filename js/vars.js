import { gerarLabirinto } from "./maze-generator.js";

export const config = {
	COLUNAS: 0,
	LINHAS: 0,
	LADO_QUADRADO: 0,
	PORCENTAGEM: 0,
};

const form = document.getElementById("varform");

form.addEventListener("submit", (event) => {
	event.preventDefault();

	config.COLUNAS = parseInt(document.getElementById("colunas").value, 10);
	config.LINHAS = parseInt(document.getElementById("linhas").value, 10);
	config.LADO_QUADRADO = parseInt(
		document.getElementById("lado-quadrado").value,
		10,
	);

	const valPORCENTAGEM = parseFloat(
		document.getElementById("porcentagem").value,
	);
	config.PORCENTAGEM = Math.max(0, Math.min(valPORCENTAGEM, 1));

	gerarLabirinto();
});
