document.addEventListener('DOMContentLoaded', () => {
    const mapImg = document.getElementById('us-map');
    const mapContainer = document.getElementById('map-container');
    const republicanVotesEl = document.getElementById('republicanVotes');
    const democratVotesEl = document.getElementById('democratVotes');
    const winnerEl = document.getElementById('winner');
    const tooltip = document.querySelector('.tooltip');
    let republicanTotal = 0;
    let democratTotal = 0;

    mapImg.onload = function() {
        const svg = new XMLSerializer().serializeToString(mapImg);
        mapContainer.innerHTML = svg;
        
        const interactiveStates = [
            'state-PA', 'state-NV', 'state-GA', 'state-MI', 
            'state-NC', 'state-AZ', 'state-WI', 'state-FL', 
            'state-MN', 'state-NM', 'state-VA', 'state-NH'
        ];

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

        initializeStates();
    };

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

    function initializeStates() {
        const initialRepublicans = ['state-FL'];
        const initialDemocrats = ['state-PA'];
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
});
