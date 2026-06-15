//Seletores
const botaoAdicionarTarefa = document.getElementById("addBtn")
const botaoListarTodas = document.getElementById("showTodas")
const inputAdicionarTarefa = document.getElementById("taskInput")
const body = document.body
const lista = document.getElementById("taskList")



let tarefas = []


//Função para mostrar as tarefas
function renderizar() {
    lista.innerHTML = ""
    let tarefasFiltradas = tarefas
    tarefasFiltradas.forEach((tarefa) => {
        const li = document.createElement("li")
        const texto = document.createElement("span")
        texto.textContent = tarefa.texto
        li.appendChild(texto)
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
    body.appendChild(mensagem)
    setTimeout(()=> {
        
        mensagem.classList.add("mensagemSumindo")
        setTimeout(()=> {
            mensagem.remove()

        },600)
    },3000)
    
})

//Listener para listar todas as tarefas
botaoListarTodas.addEventListener("click",()=> {
    renderizar()
})