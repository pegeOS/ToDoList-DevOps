//Seletores
const botaoAdicionarTarefa = document.getElementById("addBtn")
const inputAdicionarTarefa = document.getElementById("taskInput")
const lista = document.getElementById("taskList")

const botaoListarTodas = document.getElementById("showTodas")
const botaoListarAtivas = document.getElementById("showAtivas")
const botaoListarConcluidas = document.getElementById("showConcluidas")




let tarefas = []
let filtroAtual = "todas"
// default to the backend origin so fetch() works when the page
// is served from a different origin (e.g. Live Server on :5500)
const API_BASE = window.API_BASE || 'http://localhost:3000'


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

// remove notificações residuais (por segurança ao recarregar/LiveServer)
; (function clearStartupMessage() {
    const m = document.getElementById('mensagem')
    if (m) m.remove()
})();

//Listener para adicionar tarefas
botaoAdicionarTarefa.addEventListener("click", async () => {
    const texto = inputAdicionarTarefa.value.trim()
    if (!texto) return
    try {
        const id = String(Date.now())
        const resp = await fetch(`${API_BASE}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, texto, concluida: false })
        })
        if (!resp.ok) throw new Error('Falha ao adicionar tarefa')
        inputAdicionarTarefa.value = ''
        // maintain previous UX: show temporary success message and
        // update local list without forcing a full reload
        const nova = { id, texto, concluida: false }
        tarefas.push(nova)
        renderizar() // <--- ADICIONADO: Faz a nova tarefa aparecer na tela imediatamente!


        const mensagem = document.createElement("span")
        mensagem.id = "mensagem"
        mensagem.textContent = `A tarefa "${texto}" foi adicionada com sucesso! ✅`
        document.body.appendChild(mensagem)
        setTimeout(() => {
            mensagem.classList.add("mensagemSumindo")
            setTimeout(() => m.remove(), 600) // Ajustado para remover a variável correta caso necessário
        }, 3400)
    } catch (err) {
        console.error(err)
        alert('Erro ao adicionar tarefa')
    }
})

// NOVO: Listener para escutar a tecla Enter no campo de texto
inputAdicionarTarefa.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        botaoAdicionarTarefa.click() // Simula o clique e roda toda a lógica acima
    }
})

//Listener para marcar/desmarcar tarefa
lista.addEventListener("change", async (event) => {
    if (event.target.type === "checkbox") {
        const id = event.target.dataset.id
        const checked = event.target.checked
        try {
            const resp = await fetch(`${API_BASE}/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ concluida: checked })
            })
            if (!resp.ok) throw new Error('Falha ao atualizar tarefa')
            await loadTasks()
        } catch (err) {
            console.error(err)
            alert('Erro ao atualizar tarefa')
        }
    }
})


//Listener para remover tarefa 
lista.addEventListener("click", async (event) => {
    if (event.target.type === "button") {
        const id = event.target.dataset.id
        try {
            const resp = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' })
            if (!resp.ok) throw new Error('Falha ao remover')
            await loadTasks()
        } catch (err) {
            console.error(err)
            alert('Erro ao remover tarefa')
        }
    }
})

//Filtro para tarefas
botaoListarTodas.addEventListener('click', async () => {
    filtroAtual = "todas"
    await loadTasks()
})
botaoListarAtivas.addEventListener("click", async () => {
    filtroAtual = "ativas"
    await loadTasks()
})

botaoListarConcluidas.addEventListener('click', async () => {
    filtroAtual = "concluidas"
    await loadTasks()
})

async function loadTasks() {
    try {
        const resp = await fetch(`${API_BASE}/tasks`)
        if (!resp.ok) throw new Error('Falha ao buscar tarefas')
        tarefas = await resp.json()
        renderizar()
    } catch (err) {
        console.error(err)
        alert('Erro ao carregar tarefas')
    }
}

// inicializa sem puxar tarefas do servidor (não mostrar tarefas já cadastradas)
renderizar()