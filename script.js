// Static electoral votes
const staticVotes = {
  dem: {
    'California': 55, 'New York': 29, 'Illinois': 20, 'Massachusetts': 11,
    'Maryland': 10, 'Washington': 12, 'Oregon': 7, 'New Jersey': 14,
    'Connecticut': 7, 'Rhode Island': 4, 'Delaware': 3, 'Vermont': 3,
    'Hawaii': 4, 'District of Columbia': 3, 'Colorado': 10,
    'Virginia': 13, 'Minnesota': 10,
  },
  rep: {
    'Texas': 38, 'Ohio': 18, 'Indiana': 11, 'Tennessee': 11, 'Alabama': 9,
    'Missouri': 10, 'Kentucky': 8, 'Oklahoma': 7, 'Utah': 6, 'Kansas': 6,
    'Nebraska': 5, 'Idaho': 4, 'Wyoming': 3, 'South Carolina': 9,
    'Louisiana': 8, 'Alaska': 3, 'Mississippi': 6, 'Iowa': 6,
    'North Dakota': 3, 'South Dakota': 3, 'Montana': 4, 'Arkansas': 6,
    'West Virginia': 4,
  }
};

// Swing states data
const swingStates = [
  { name: 'Pennsylvania', votes: 19 }, { name: 'Nevada', votes: 6 },
  { name: 'Georgia', votes: 16 }, { name: 'Michigan', votes: 15 },
  { name: 'North Carolina', votes: 16 }, { name: 'Arizona', votes: 11 },
  { name: 'Wisconsin', votes: 10 }, { name: 'Florida', votes: 30 },
  { name: 'Minnesota', votes: 10 }, { name: 'New Mexico', votes: 5 },
  { name: 'Virginia', votes: 13 }, { name: 'New Hampshire', votes: 4 },
];

let chart;

function initializeDragAndDrop() {
  const containers = document.querySelectorAll('.state-container');
  containers.forEach(container => {
    container.addEventListener('dragover', dragOver);
    container.addEventListener('drop', drop);
  });
}

function createStateElement(state, votes) {
  const stateElement = document.createElement('div');
  stateElement.className = 'state';
  stateElement.textContent = `${state} (${votes})`;
  stateElement.draggable = true;
  stateElement.addEventListener('dragstart', dragStart);
  return stateElement;
}

function populateStates() {
  const demContainer = document.getElementById('dem-container');
  const repContainer = document.getElementById('rep-container');
  const swingContainer = document.getElementById('swing-container');

  for (const [state, votes] of Object.entries(staticVotes.dem)) {
    demContainer.appendChild(createStateElement(state, votes));
  }

  for (const [state, votes] of Object.entries(staticVotes.rep)) {
    repContainer.appendChild(createStateElement(state, votes));
  }

  for (const state of swingStates) {
    swingContainer.appendChild(createStateElement(state.name, state.votes));
  }
}

function dragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.textContent);
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const data = e.dataTransfer.getData('text');
  const draggedElement = document.querySelector(`.state:not(.dragging)`);
  
  if (e.target.classList.contains('state-container')) {
    e.target.appendChild(draggedElement);
  } else if (e.target.classList.contains('state')) {
    e.target.parentNode.insertBefore(draggedElement, e.target.nextSibling);
  }
  
  updateColors();
  updateResults();
}

function updateColors() {
  document.querySelectorAll('.state').forEach(state => {
    const container = state.parentElement;
    if (container.id === 'dem-container') {
      state.style.backgroundColor = '#d1e7dd';
      state.style.borderColor = '#0f5132';
    } else if (container.id === 'rep-container') {
      state.style.backgroundColor = '#f8d7da';
      state.style.borderColor = '#842029';
    } else {
      state.style.backgroundColor = '#fff3cd';
      state.style.borderColor = '#664d03';
    }
  });
}

function updateResults() {
  let demTotal = 0;
  let repTotal = 0;

  document.querySelectorAll('#dem-container .state').forEach(state => {
    demTotal += parseInt(state.textContent.match(/\d+/)[0]);
  });

  document.querySelectorAll('#rep-container .state').forEach(state => {
    repTotal += parseInt(state.textContent.match(/\d+/)[0]);
  });

  document.getElementById('dem-total').textContent = demTotal;
  document.getElementById('rep-total').textContent = repTotal;

  updateChart(demTotal, repTotal);
  updateWinnerDisplay(demTotal, repTotal);
}

function updateChart(demTotal, repTotal) {
  const ctx = document.getElementById('results-chart').getContext('2d');
  
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Democrats', 'Republicans'],
      datasets: [{
        data: [demTotal, repTotal],
        backgroundColor: ['#0f5132', '#842029'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'Electoral College Results'
        }
      }
    }
  });
}

function updateWinnerDisplay(demTotal, repTotal) {
  const winnerDisplay = document.getElementById('winner-display');
  const winnerText = document.getElementById('winner-text');

  if (demTotal >= 270 && demTotal > repTotal) {
    winnerDisplay.classList.remove('hidden');
    winnerText.innerText = 'Winner: Democrats 🎉';
  } else if (repTotal >= 270 && repTotal > demTotal) {
    winnerDisplay.classList.remove('hidden');
    winnerText.innerText = 'Winner: Republicans 🎉';
  } else {
    winnerDisplay.classList.add('hidden');
    winnerText.innerText = '';
  }
}

function resetSwingStates() {
  const swingContainer = document.getElementById('swing-container');
  document.querySelectorAll('#dem-container .state, #rep-container .state').forEach(state => {
    if (!Object.keys(staticVotes.dem).includes(state.textContent.split(' ')[0]) &&
        !Object.keys(staticVotes.rep).includes(state.textContent.split(' ')[0])) {
      swingContainer.appendChild(state);
    }
  });
  updateColors();
  updateResults();
}

function init() {
  populateStates();
  initializeDragAndDrop();
  updateResults();

  const resetButton = document.getElementById('reset-button');
  if (resetButton) {
    resetButton.addEventListener('click', resetSwingStates);
  }
}

window.onload = init;
