document.addEventListener('DOMContentLoaded', () => {
    const republicanVotesEl = document.getElementById('republicanVotes');
    const democratVotesEl = document.getElementById('democratVotes');
    const winnerEl = document.getElementById('winner');
    const tooltip = document.querySelector('.tooltip');
    let republicanTotal = 0;
    let democratTotal = 0;

    // List of interactive state IDs
    const interactiveStates = [
        'state-PA', // Pennsylvania (19)
        'state-NV', // Nevada (6)
        'state-GA', // Georgia (16)
        'state-MI', // Michigan (15)
        'state-NC', // North Carolina (16)
        'state-AZ', // Arizona (11)
        'state-WI', // Wisconsin (10)
        'state-FL', // Florida (30)
        'state-MN', // Minnesota (10)
        'state-NM', // New Mexico (5)
        'state-VA', // Virginia (13)
        'state-NH'  // New Hampshire (4)
    ];

    // Attach event listeners to interactive states
    interactiveStates.forEach(id => {
        const state = document.getElementById(id);
        if (state) {
            state.addEventListener('click', () => {
                toggleState(state);
                calculateResults();
            });
            state.addEventListener('mouseenter', () => {
                const name = state.getAttribute('data-name');
                const votes = state.getAttribute('data-votes');
                tooltip.innerHTML = `${name}: ${votes} Wahlleute`;
                tooltip.style.display = 'block';
            });
            state.addEventListener('mousemove', (e) => {
                tooltip.style.left = e.pageX + 10 + 'px';
                tooltip.style.top = e.pageY + 10 + 'px';
            });
            state.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        }
    });

    // Function to toggle state between Republican and Democrat
    function toggleState(state) {
        const votes = parseInt(state.getAttribute('data-votes'));
        if (state.classList.contains('republican')) {
            state.classList.remove('republican');
            state.classList.add('democrat');
            republicanTotal -= votes;
            democratTotal += votes;
        } else if (state.classList.contains('democrat')) {
            state.classList.remove('democrat');
            republicanTotal -= votes;
        } else {
            state.classList.add('republican');
            republicanTotal += votes;
        }
    }

    // Function to calculate and display results
    function calculateResults() {
        republicanVotesEl.textContent = republicanTotal;
        democratVotesEl.textContent = democratTotal;
        if (republicanTotal >= 270) {
            winnerEl.textContent = 'Aktueller Gewinner: Republikaner';
        } else if (democratTotal >= 270) {
            winnerEl.textContent = 'Aktueller Gewinner: Demokraten';
        } else {
            winnerEl.textContent = 'Noch kein Gewinner';
        }
    }

    // Initialize states with initial assignments
    function initializeStates() {
        // Define initial Republican and Democrat states
        const initialRepublicans = ['state-FL']; // Florida initially Republican
        const initialDemocrats = ['state-PA'];    // Pennsylvania initially Democrat

        initialRepublicans.forEach(id => {
            const state = document.getElementById(id);
            if (state) {
                state.classList.add('republican');
                republicanTotal += parseInt(state.getAttribute('data-votes'));
            }
        });

        initialDemocrats.forEach(id => {
            const state = document.getElementById(id);
            if (state) {
                state.classList.add('democrat');
                democratTotal += parseInt(state.getAttribute('data-votes'));
            }
        });

        calculateResults();
    }

    initializeStates();
});
