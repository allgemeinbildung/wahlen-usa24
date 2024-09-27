// Static electoral votes
const staticVotes = {
  dem: {
    // Democratic static states and their electoral votes
    'California': 55,
    'New York': 29,
    'Illinois': 20,
    'Massachusetts': 11,
    'Maryland': 10,
    'Washington': 12,
    'Oregon': 7,
    'New Jersey': 14,
    'Connecticut': 7,
    'Rhode Island': 4,
    'Delaware': 3,
    'Vermont': 3,
    'Hawaii': 4,
    'District of Columbia': 3,
    'Colorado': 10,
    'Virginia': 13,
    'Minnesota': 10
  },
  rep: {
    // Republican static states and their electoral votes
    'Texas': 38,
    'Ohio': 18,
    'Indiana': 11,
    'Tennessee': 11,
    'Alabama': 9,
    'Missouri': 10,
    'Kentucky': 8,
    'Oklahoma': 7,
    'Utah': 6,
    'Kansas': 6,
    'Nebraska': 5,
    'Idaho': 4,
    'Wyoming': 3,
    'South Carolina': 9,
    'Louisiana': 8,
    'Alaska': 3,
    'Mississippi': 6,
    'Iowa': 6,
    'North Dakota': 3,
    'South Dakota': 3,
    'Montana': 4,
    'Arkansas': 6,
    'West Virginia': 4
    // Add other Republican static states if any
  }
};

// Swing states data
const swingStates = [
  { name: 'Pennsylvania', votes: 19, assigned: null },
  { name: 'Nevada', votes: 6, assigned: null },
  { name: 'Georgia', votes: 16, assigned: null },
  { name: 'Michigan', votes: 15, assigned: null },
  { name: 'North Carolina', votes: 16, assigned: null },
  { name: 'Arizona', votes: 11, assigned: null },
  { name: 'Wisconsin', votes: 10, assigned: null },
  { name: 'Florida', votes: 30, assigned: null },
  { name: 'Minnesota', votes: 10, assigned: null },
  { name: 'New Mexico', votes: 5, assigned: null },
  { name: 'Virginia', votes: 13, assigned: null },
  { name: 'New Hampshire', votes: 4, assigned: null },
];

// Initialize totals
let totalDem = 0;
let totalRep = 0;

// Function to calculate static totals
function calculateStaticTotals() {
  totalDem = 0;
  totalRep = 0;
  for (let state in staticVotes.dem) {
    totalDem += staticVotes.dem[state];
  }
  for (let state in staticVotes.rep) {
    totalRep += staticVotes.rep[state];
  }
}

// Function to update totals and the electoral college bar
function updateTotals() {
  // Reset swing totals
  let swingDem = 0;
  let swingRep = 0;

  swingStates.forEach(state => {
    if (state.assigned === 'dem') {
      swingDem += state.votes;
    } else if (state.assigned === 'rep') {
      swingRep += state.votes;
    }
  });

  // Calculate total votes
  const currentDemTotal = totalDem + swingDem;
  const currentRepTotal = totalRep + swingRep;

  const totalAssigned = currentDemTotal + currentRepTotal;

  // Handle Overflows
  if (totalAssigned > 538) {
    alert("Total electoral votes exceed 538. Please adjust your assignments.");
    return;
  }

  // Update DOM
  document.getElementById('dem-total').innerText = currentDemTotal;
  document.getElementById('rep-total').innerText = currentRepTotal;

  // Update Electoral College Bar
  const totalVotes = 538;
  const demPercentage = ((currentDemTotal / totalVotes) * 100).toFixed(1);
  const repPercentage = ((currentRepTotal / totalVotes) * 100).toFixed(1);

  const demBar = document.getElementById('dem-bar');
  const repBar = document.getElementById('rep-bar');

  demBar.style.width = `${demPercentage}%`;
  repBar.style.width = `${repPercentage}%`;

  // Update Percentage Labels
  document.getElementById('dem-percentage').innerText = `${demPercentage}%`;
  document.getElementById('rep-percentage').innerText = `${repPercentage}%`;

  // Update Tooltips
  demBar.setAttribute('data-tooltip', `Democrats: ${currentDemTotal} votes`);
  repBar.setAttribute('data-tooltip', `Republicans: ${currentRepTotal} votes`);

  // Update Winner Display
  const winnerDisplay = document.getElementById('winner-display');
  const winnerText = document.getElementById('winner-text');

  if (currentDemTotal >= 270 && currentDemTotal > currentRepTotal) {
    winnerDisplay.classList.remove('hidden');
    winnerText.innerText = 'Winner: Democrats 🎉';
  } else if (currentRepTotal >= 270 && currentRepTotal > currentDemTotal) {
    winnerDisplay.classList.remove('hidden');
    winnerText.innerText = 'Winner: Republicans 🎉';
  } else {
    winnerDisplay.classList.add('hidden');
    winnerText.innerText = '';
  }

  // Victory Indicator
  if (currentDemTotal >= 270 && currentDemTotal > currentRepTotal) {
    demBar.classList.add('victory');
    repBar.classList.remove('victory');
  } else if (currentRepTotal >= 270 && currentRepTotal > currentDemTotal) {
    repBar.classList.add('victory');
    demBar.classList.remove('victory');
  } else {
    demBar.classList.remove('victory');
    repBar.classList.remove('victory');
  }
}

// Function to handle swing state click
function handleSwingStateClick(event) {
  const stateElement = event.target;
  const stateName = stateElement.textContent.split(' (')[0];
  const state = swingStates.find(s => s.name === stateName);

  if (!state) return;

  // Toggle assignment
  if (state.assigned === 'dem') {
    state.assigned = 'rep';
    stateElement.classList.remove('selected-dem');
    stateElement.classList.add('selected-rep');
  } else if (state.assigned === 'rep') {
    state.assigned = null;
    stateElement.classList.remove('selected-rep');
  } else {
    state.assigned = 'dem';
    stateElement.classList.add('selected-dem');
  }

  updateTotals();
}

// Function to reset all swing states
function resetSwingStates() {
  swingStates.forEach(state => {
    state.assigned = null;
    const stateIndex = swingStates.indexOf(state) + 1;
    const stateElement = document.querySelector(`.swing-state:nth-child(${stateIndex})`);
    if (stateElement) {
      stateElement.classList.remove('selected-dem', 'selected-rep');
    }
  });
  updateTotals();
}

// Initialize the application
function init() {
  calculateStaticTotals();
  updateTotals();

  // Add event listeners to swing states
  const swingElements = document.querySelectorAll('.swing-state');
  swingElements.forEach(element => {
    element.addEventListener('click', handleSwingStateClick);
  });

  // Add event listener to reset button
  const resetButton = document.getElementById('reset-button');
  if (resetButton) {
    resetButton.addEventListener('click', resetSwingStates);
  }
}

// Run init on page load
window.onload = init;
