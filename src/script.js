//Seletores
const botaoAdicionarTarefa = document.getElementById("addBtn")
const inputAdicionarTarefa = document.getElementById("taskInput")
const lista = document.getElementById("taskList")

const botaoListarTodas = document.getElementById("showTodas")
const botaoListarAtivas = document.getElementById("showAtivas")
const botaoListarConcluidas = document.getElementById("showConcluidas")




let tarefas = []
let filtroAtual = "todas"


//Função para mostrar as tarefas
function renderizar() {
    lista.innerHTML = ""

   const tarefasFiltradas = tarefas.filter(tarefa => {
        if (filtroAtual === "ativas") return !tarefa.concluida
        if (filtroAtual === "concluidas") return tarefa.concluida
        return true // "todas"
    })

    tarefasFiltradas.forEach((tarefa) => {
        const li = document.createElement("li")
        
        // Checkbox para marcar como concluída
        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.checked = tarefa.concluida
        checkbox.dataset.id = tarefa.id
        
        const texto = document.createElement("span")
        texto.textContent = tarefa.texto
        if (tarefa.concluida) {
            texto.style.textDecoration = "line-through" // Efeito visual de concluído
        }
        
        // Botão de remover
        const botaoDeletar = document.createElement("button")
        botaoDeletar.type = "button"
        botaoDeletar.textContent = "X"
        botaoDeletar.dataset.id = tarefa.id

        // Montando o item da lista
        li.appendChild(checkbox)
        li.appendChild(texto)
        li.appendChild(botaoDeletar)
        lista.appendChild(li)
    })
}

//Listener para adicionar tarefas
botaoAdicionarTarefa.addEventListener("click",()=> {
    const texto = inputAdicionarTarefa.value
    if (!texto) return 
    tarefas.push({id: Date.now(),texto: texto,concluida: false})
    inputAdicionarTarefa.value = ""
    const mensagem = document.createElement("span")
    mensagem.id = "mensagem"
    mensagem.textContent = `A tarefa ${texto} foi adicionada com sucesso!✅`
    document.body.appendChild(mensagem)
    setTimeout(()=> {
        
        mensagem.classList.add("mensagemSumindo")
        setTimeout(()=> {
            mensagem.remove()

        },600)
    },3000)
    
})

//Listener para marcar/desmarcar tarefa
lista.addEventListener("change",(event) => {
    if (event.target.type === "checkbox") {
        const id = Number(event.target.dataset.id)
        const tarefa = tarefas.find(t => t.id === id)
        if (tarefa) {
            tarefa.concluida = event.target.checked
            renderizar()
        }
    }
    
})


//Listener para remover tarefa 
lista.addEventListener("click",(event) => {
    if (event.target.type === "button") {
        const id = Number(event.target.dataset.id)
        tarefas = tarefas.filter(t => t.id !== id)
        renderizar()
    }
})

//Filtro para tarefas
botaoTodasTasks.addEventListener('click',() => {
    filtroAtual = "todas"
    renderizar()
})
botaoTasksAtivas.addEventListener("click",()=> {
    filtroAtual = "ativas"
    renderizar()
})

botaoTasksConcluidas.addEventListener('click',()=> {
    filtroAtual = "concluidas"
    renderizar()
})