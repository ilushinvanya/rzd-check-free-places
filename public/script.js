async function handleSubmit() {
  const dateInput = document.getElementById('date');
  const ticketInput = document.getElementById('ticketNumber');
  const errorMsg = document.getElementById('errorMsg');
  const resultCard = document.getElementById('resultCard');
  const spinner = document.getElementById('spinner');
  const submitBtn = document.getElementById('submitBtn');

  const date = dateInput.value;
  const ticketNumber = ticketInput.value.trim();

  errorMsg.className = 'error-msg';
  resultCard.className = 'result-card';

  if (!date || !ticketNumber) {
    showError('Заполните дату и номер билета');
    return;
  }

  // Convert date from YYYY-MM-DD to DD.MM.YYYY for the API
  const [y, m, d] = date.split('-');
  const formattedDate = `${d}.${m}.${y}`;

  submitBtn.disabled = true;
  spinner.className = 'spinner visible';

  try {
    const res = await fetch('/api/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: formattedDate, ticketNumber }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Ошибка сервера' }));
      throw new Error(err.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    renderResult(data);
  } catch (e) {
    showError(e.message);
  } finally {
    submitBtn.disabled = false;
    spinner.className = 'spinner';
  }
}

function renderResult(data) {
  const placesList = document.getElementById('placesList');
  const ticketData = document.getElementById('ticketData');
  const svgWrapper = document.getElementById('svgWrapper');
  const resultCard = document.getElementById('resultCard');
  const seatsStyle = document.getElementById('seatsStyle');
  if (seatsStyle) seatsStyle.remove();

  placesList.innerHTML = '';
  svgWrapper.innerHTML = '';
  ticketData.innerHTML = '';

  const allPlaces = (data.freePlaces || []).flat();
  if (allPlaces.length === 0) {
    placesList.innerHTML =
      '<span style="color:#999">Свободных мест не найдено</span>';
  } else {
    let ids = '';
    allPlaces.sort((a, b) => a - b).forEach((place) => {
      // const badge = document.createElement('span');
      // badge.className = 'place-badge';
      // badge.textContent = place;
      // placesList.appendChild(badge);
      ids += `#Seat${place},`;
    });

    ids = ids.slice(0, -1);

    const style = document.createElement('style');
    style.setAttribute('id', 'seatsStyle');
    style.textContent = `
          ${ids} {
            fill: #81bfff;
            stroke: #5583de;
          }
        `;
    document.head.appendChild(style);
  }

  if (data.svg) {
    svgWrapper.innerHTML = data.svg;
  } else {
    svgWrapper.innerHTML =
      '<span style="color:#999">Схема вагона недоступна</span>';
  }

  resultCard.className = 'result-card visible';

  const formatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'UTC',
  });
  const datetime = formatter.format(new Date(`${data.ticket.dateoper}T${data.ticket.timeoper}:00.000Z`));
  
  ticketData.innerHTML = `<table>
        <tr><td>Откуда:</td> <td>${data.ticket.stdep}</td></tr>
        <tr><td>Куда:</td> <td>${data.ticket.starr}</td></tr>
        <tr><td>Когда:</td> <td> ${datetime}</td></tr>
        <tr><td>Поезд:</td> <td>${data.ticket.train}</td></tr>
        <tr><td>Вагон:</td> <td> ${data.ticket.vag}</td></tr>
      </table>`;
}

function showError(msg) {
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = msg;
  errorMsg.className = 'error-msg visible';
}

// Allow Enter key to submit
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSubmit();
});
