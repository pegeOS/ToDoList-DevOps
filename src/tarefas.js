function criarTarefa(texto) {
  return {
    id: Date.now(),
    texto: texto,
    concluida: false
  };
}

function adicionarTarefa(tarefas, texto) {
  if (!texto) return tarefas;
  const novaTarefa = criarTarefa(texto);
  return [...tarefas, novaTarefa];
}

function marcarConcluida(tarefas, id, concluida) {
  return tarefas.map(t =>
    t.id === id ? { ...t, concluida: concluida } : t
  );
}

function removerTarefa(tarefas, id) {
  return tarefas.filter(t => t.id !== id);
}

function filtrarTarefas(tarefas, filtro) {
  if (filtro === "ativas") return tarefas.filter(t => !t.concluida);
  if (filtro === "concluidas") return tarefas.filter(t => t.concluida);
  return tarefas;
}

module.exports = {
  criarTarefa,
  adicionarTarefa,
  marcarConcluida,
  removerTarefa,
  filtrarTarefas
};
