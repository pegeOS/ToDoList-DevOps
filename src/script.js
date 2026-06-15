//Seletores
const botaoAdicionarTarefa = document.getElementById("addBtn")
const inputAdicionarTarefa = document.getElementById("taskInput")
const lista = document.getElementById("taskList")

let tarefas = []


//Função para mostrar as tarefas
function renderizar() {
    lista.innerHTML = ""
    let tarefasFiltradas = tarefas
    tarefasFiltradas.forEach(() => {
        const li = document.createElement("li")
        const texto = document.createElement("span")
        li.appendChild(texto)

    })
}

//Listener para adicionar tarefas
botaoAdicionarTarefa.addEventListener("click",()=> {
    const texto = inputAdicionarTarefa.value
    if (!texto) return 
    tarefas.push({id: Date.now(),texto: texto,concluida: false})
    inputAdicionarTarefa.value = ""
    alert(`Tarefa '${texto}' adicionada com sucesso!`)
})