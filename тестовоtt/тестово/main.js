const bodyMessageElement = document.getElementById("message");
const timeSendElement = document.getElementById("second");
const btnSend = document.getElementById("btnSend");
const form = document.getElementById("myForm"); // Получаем форму
const maxLengthMessage = 55;
const table = document.getElementById("table");


function createTableRow(table) {
  let row = table.insertRow();
  let cell1 = row.insertCell();
  let cell2 = row.insertCell();
  let cell3 = row.insertCell();
  let cell4 = row.insertCell();
  let cell5 = row.insertCell();

  return {
    row: row,
    cell1: cell1,
    cell2: cell2,
    cell3: cell3,
    cell4: cell4,
    cell5: cell5
  };
}

form.addEventListener('submit', function (event) {
  event.preventDefault();

  showLateMessage();
  bodyMessageElement.value = '';
  timeSendElement.value = '';
  btnSend.disabled = true;

})

btnSend.disabled = true;
function showLateMessage() {
  const message = bodyMessageElement.value;
  const delay = Number(timeSendElement.value) * 1000;
  let finishTime = Date.now() + delay;
  let timeInterval;

  if (!message || isNaN(delay) || delay < 0) {
    console.error("Некорректные значения для сообщения или времени.");
    return; // 
  }
  const tableCells = createTableRow(table);

  tableCells.cell1.textContent = message.length > maxLengthMessage ? message.substring(0, maxLengthMessage) + "..." : message;
  tableCells.cell3.textContent = "Pending";
  tableCells.cell4.innerHTML = '<button class="change" title="Редактировать сообщение"><img src="icons8-редактировать.svg" width=8px height=10px></button>';
  tableCells.cell5.innerHTML = '<button class="change delete" id="btnDelete" title="Удалить отправленное сообщение"><img src="dustbin_120823.svg" width=8px height=10px></button>';



  function updateTime() {
    const remainingTime = finishTime - Date.now();
    if (remainingTime <= 0) {
      tableCells.cell2.textContent = "-";
      tableCells.cell3.textContent = 'Sended';
      tableCells.cell4.innerHTML = '';
      tableCells.cell5.innerHTML = '';


      clearInterval(timeInterval);
      return;
    }
    else {
      tableCells.cell2.textContent = formatTime(remainingTime) + " left";
      timeInterval = setTimeout(updateTime, 0); // главная фишка, как создается таймер (ассинхрон)
    }
  }

  updateTime();  //для обновления строк
  


  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);

    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    let timeRem = "";

    if (days > 0) {
      timeRem += `${String(days)}d `;
    }

    timeRem += `${String(hours)}h ${String(minutes)}m ${String(seconds)}s`;

    return timeRem;
  
  }
  //дальше функции для работы внутри попапа
if (tableCells.cell3.textContent !== 'Sended'){

  const dialog = document.getElementById('popup');
  const dialogCloser = document.querySelector('.wrap');
  const btnCLose = document.getElementById('btnCLose');
  const btnChange = tableCells.cell4.querySelector('.change');
  const btnDelete = tableCells.cell5.querySelector(".delete");



 
  btnChange.onclick = function () {
    openModal();
    changeTimeandMessage(tableCells.cell1)

    btnCLose.onclick = function () { closeModal() };

    dialogCloser.addEventListener('click', function (event) {
      if (event.target === dialogCloser || event.target === btnUpdate) { // Клик для закрытия именно по оверлею
        closeModal();
      }
    });
   
  

  }

  function openModal() {
    dialog.classList.add('open');
    dialogCloser.classList.add('open')
  }

  function closeModal() {

    dialog.classList.remove('open');
    dialogCloser.classList.remove('open');
  };


  function changeTimeandMessage(cellEdit) { //редактирование времени и сообщения

    const elementTimeNew = document.getElementById("secondother");
    let newMessage = document.getElementById('message-new');
    const btnUpdate = document.getElementById("btnUpdate");
    const input = document.getElementById("secondother");

    elementTimeNew.value = '';
    newMessage.value = cellEdit.textContent
    btnUpdate.disabled = true;



    btnUpdate.onclick = function () {
      if (elementTimeNew.value !== '') {
        newTimeSend();
      }
      if (newMessage.value !== '') {
        mewMessageSend(cellEdit,maxLengthMessage);
      }
      alert('данные обновлены')
    };


    function newTimeSend() {
      const newDelay = Number(elementTimeNew.value) * 1000;
      finishTime = Date.now() + newDelay;



      if (isNaN(newDelay)||newDelay < 0) {
        alert("Некорректные значения для сообщения или времени.");
        return;
      }
      else { clearInterval(timeInterval); }
      updateTime();

    }

    function mewMessageSend(cellEdit,maxLengthMessage) {
      messageEdit = newMessage.value
      cellEdit.textContent = messageEdit.length > maxLengthMessage ? messageEdit.substring(0, maxLengthMessage) + "..." : messageEdit;

    }

    // блок кнопки в попапе
    input.addEventListener('input', function () {
      btnUpdate.disabled = !(input.value !== '' && input.value >= 0); 
  });

    newMessage.addEventListener('input', function () {
      btnUpdate.disabled = false;
    })

  }

  btnDelete.onclick = function () {
    tableCells.row.remove();
  }

}
}

// блок кнопки в форме
bodyMessageElement.addEventListener('input', function () {
  btnSend.disabled = !(bodyMessageElement.value !== '' && timeSendElement.value !== ''); 
});

timeSendElement.addEventListener('input', function () {
  btnSend.disabled = !(bodyMessageElement.value !== '' && timeSendElement.value !== ''); 
});





