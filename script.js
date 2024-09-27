// Static electoral votes
const staticVotes = {
  dem: {
    // Add all Democratic static states and their electoral votes
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
    'District of Columbia': 3
    // Add other Democratic static states if any
  },
  rep: {
    // Add all Republican static states and their electoral votes
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
    'Alaska': 3
    // Ensure Arizona is not listed here as it's a swing state
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

  // Update DOM
  document.getElementById('dem-total').innerText = currentDemTotal;
  document.getElementById('rep-total').innerText = currentRepTotal;

  // Update Electoral College Bar
  const totalVotes = 538;
  const demPercentage = (currentDemTotal / totalVotes) * 100;
  const repPercentage = (currentRepTotal / totalVotes) * 100;

  document.getElementById('dem-bar').style.width = `${demPercentage}%`;
  document.getElementById('rep-bar').style.width = `${repPercentage}%`;

  // Optional: Handle cases where percentages exceed 100%
  // This can occur if the static and swing votes do not sum to 538
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
    const stateElement = document.querySelector(`.swing-state:nth-child(${swingStates.indexOf(state) + 1})`);
    stateElement.classList.remove('selected-dem', 'selected-rep');
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
