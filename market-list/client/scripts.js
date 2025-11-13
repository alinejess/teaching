

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/produtos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.produtos.forEach(item => insertList(item.nome, item.quantidade, item.valor))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append('nome', inputProduct);
  formData.append('quantidade', inputQuantity);
  formData.append('valor', inputPrice);

  let url = 'http://127.0.0.1:5000/produto';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Criar config.py


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/produto?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  if (inputProduct === '') {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    insertList(inputProduct, inputQuantity, inputPrice)
    postItem(inputProduct, inputQuantity, inputPrice)
    alert("Item adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameProduct, quantity, price) => {
  var item = [nameProduct, quantity, price]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }

  let editCell = row.insertCell(-1);
  editCell.innerHTML = "<span class='edit-btn' style='cursor:pointer;'>⚙</span>";

  insertButton(row.insertCell(-1))
  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";

  removeElement()
  enableEditButtons()
}

/*
  --------------------------------------------------------------------------------------
  Função para botão de editar
  --------------------------------------------------------------------------------------
*/
const enableEditButtons = () => {
  let edits = document.getElementsByClassName("edit-btn");

  for (let i = 0; i < edits.length; i++) {
    edits[i].onclick = function () {
      const row = this.parentElement.parentElement;
      onEditItem(row);
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deixar uma linha editável (uma linha por vez)
  --------------------------------------------------------------------------------------
*/
const onEditItem = (row) => {
  const nameCell = row.cells[0];
  const qtyCell = row.cells[1];
  const priceCell = row.cells[2];
  const editCell = row.cells[3];

  const oldName = nameCell.textContent;
  const oldQty = qtyCell.textContent;
  const oldPrice = priceCell.textContent;

  nameCell.innerHTML  = `<input value="${oldName}">`;
  qtyCell.innerHTML   = `<input value="${oldQty}" type="number">`;
  priceCell.innerHTML = `<input value="${oldPrice}" type="number">`;

  // Trocar botão ⚙ → Salvar
  editCell.innerHTML = `
      <button class="save-btn">Salvar</button>
      <button class="cancel-btn">Cancelar</button>
  `;

  // Eventos
  editCell.querySelector('.save-btn').onclick = () =>
    confirmItemEdition(row, oldName);

  editCell.querySelector('.cancel-btn').onclick = () =>
    cancelItemEdition(row, oldName, oldQty, oldPrice);
}

/*
  --------------------------------------------------------------------------------------
  Botão para cancelar edição
  --------------------------------------------------------------------------------------
*/
const cancelItemEdition = (row, oldName, oldQty, oldPrice) => {
  row.cells[0].textContent = oldName;
  row.cells[1].textContent = oldQty;
  row.cells[2].textContent = oldPrice;

  // voltar o botão ⚙ na MESMA célula
  row.cells[3].innerHTML = `<span class='edit-btn' style='cursor:pointer;'>⚙</span>`;

  enableEditButtons();
  removeElement()
}

/*
  --------------------------------------------------------------------------------------
  Função para salvar edição
  --------------------------------------------------------------------------------------
*/
const confirmItemEdition = (row, oldName) => {
  const newName = row.cells[0].querySelector("input").value;
  const newQty = row.cells[1].querySelector("input").value;
  const newPrice = row.cells[2].querySelector("input").value;

  updateItem(oldName, newName, newQty, newPrice);

  row.cells[0].textContent = newName;
  row.cells[1].textContent = newQty;
  row.cells[2].textContent = newPrice;

  row.cells[3].innerHTML = `<span class='edit-btn' style='cursor:pointer;'>⚙</span>`;

  enableEditButtons();
}


/*
  --------------------------------------------------------------------------------------
  Função que envia o put (atualiza)
  --------------------------------------------------------------------------------------
*/
const updateItem = (oldName, newName, newQty, newPrice) => {
  const formData = new FormData();
  formData.append("nome", newName);
  formData.append("quantidade", newQty);
  formData.append("valor", newPrice);

  let url = `http://127.0.0.1:5000/produto?nome=${oldName}`;

  fetch(url, {
    method: 'put',
    body: formData
  })
    .then(response => response.json())
    .then(data => console.log("Item atualizado:", data))
    .catch(err => console.error("Erro ao atualizar:", err));
}