const {
  adicionarTarefa,
  marcarConcluida,
  removerTarefa,
  filtrarTarefas
} = require('../src/tarefas');

describe('Gerenciamento de Tarefas', () => {

  test('deve adicionar uma tarefa', () => {
    const tarefas = [];
    const resultado = adicionarTarefa(tarefas, 'Estudar Docker');
    expect(resultado.length).toBe(1);
    expect(resultado[0].texto).toBe('Estudar Docker');
    expect(resultado[0].concluida).toBe(false);
  });

  test('não deve adicionar tarefa com texto vazio', () => {
    const tarefas = [];
    const resultado = adicionarTarefa(tarefas, '');
    expect(resultado.length).toBe(0);
  });

  test('deve marcar tarefa como concluída', () => {
    const tarefas = [{ id: 1, texto: 'Aprender Jest', concluida: false }];
    const resultado = marcarConcluida(tarefas, 1, true);
    expect(resultado[0].concluida).toBe(true);
  });

  test('deve remover uma tarefa', () => {
    const tarefas = [
      { id: 1, texto: 'Tarefa 1', concluida: false },
      { id: 2, texto: 'Tarefa 2', concluida: false }
    ];
    const resultado = removerTarefa(tarefas, 1);
    expect(resultado.length).toBe(1);
    expect(resultado[0].id).toBe(2);
  });

  test('deve filtrar apenas tarefas ativas', () => {
    const tarefas = [
      { id: 1, texto: 'Ativa', concluida: false },
      { id: 2, texto: 'Concluída', concluida: true }
    ];
    const resultado = filtrarTarefas(tarefas, 'ativas');
    expect(resultado.length).toBe(1);
    expect(resultado[0].texto).toBe('Ativa');
  });

  test('deve filtrar apenas tarefas concluídas', () => {
    const tarefas = [
      { id: 1, texto: 'Ativa', concluida: false },
      { id: 2, texto: 'Concluída', concluida: true }
    ];
    const resultado = filtrarTarefas(tarefas, 'concluidas');
    expect(resultado.length).toBe(1);
    expect(resultado[0].texto).toBe('Concluída');
  });

});
