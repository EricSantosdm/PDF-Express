'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbPack) => localStorage.setItem("db_client", JSON.stringify(dbPack))

// CRUD com Factory
const deletePack = (index) => {
    const dbPack = readPack()
    dbPack.splice(index, 1)
    setLocalStorage(dbPack)
}

const updatePack = (index, client) => {
    const dbPack = readPack()
    dbPack[index] = client
    setLocalStorage(dbPack)
}

const readPack = () => getLocalStorage()

const createPack = (client) => {
    const dbPack = getLocalStorage()
    dbPack.push (client)
    setLocalStorage(dbPack)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

 //Fachada UML 
const savePack = () => {
    debugger
    if (isValidFields()) {
        const client = {
            codigo: "BR"+getRandomInt(1000000,9999999)+"PDF",
            nome: document.getElementById('nome').value,
            destino: document.getElementById('destino').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value,
            local: document.getElementById('local').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createPack(client)
            updateTable()
            closeModal()
        } else {
            updatePack(index, client)
            updateTable()
            closeModal()
        }
    }
}

//
const createRow = (client, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td>${client.codigo}</td>
    <td>${client.nome}</td>
        <td>${client.destino}</td>
        <td>${client.celular}</td>
        <td>${client.local}</td>
        <td>${client.cidade}</td>
        <td><a href="https://www.google.com.br/maps/place/+${client.destino}"target="_blank"> Rota</a></td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tablePack>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tablePack>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbPack = readPack()
    clearTable()
    dbPack.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('destino').value = client.destino
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editPack = (index) => {
    const client = readPack()[index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editPack(index)
        } else {
            const client = readPack()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if (response) {
                deletePack(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarPacote')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', savePack)

document.querySelector('#tablePack>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)