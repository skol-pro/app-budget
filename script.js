window.addEventListener('load', init);

// Inputs
let depensesInputs = [];
let recettesInputs = [];
let epargneInputs = [];

// Buttons
let refreshButton;
let resetButton;
let addOtherDepenseBtn;
let addOtherRecetteBtn;

// Budget results
let depensesResult = 0;
let recettesResult = 0;
let epargneResult = 0;
let resultatBudget = 0;

// Total result display elements
let depensesResultTotalSpan;
let recettesResultTotalSpan;
let epargneResultTotalSpan;
let resultResultTotalSpan;

// Message element
let messageEl;

// Others field counts
let othersCounts = {
    'depense': 0,
    'recette': 0
};

// Others field wrapper
let depensesOtherWrapper;
let recettesOtherWrapper;


/**
 * Init
 */
function init() {
    // Get inputs and convert returned NodeList to Array
    // to be able to push later
    depensesInputs = Array.from(document.querySelectorAll('#depenses input'));
    recettesInputs = Array.from(document.querySelectorAll('#recettes input'));
    epargneInputs = Array.from(document.querySelectorAll('#epargne input'));

    // Get message element
    messageEl = document.getElementById('message');

    // Get refresh button and add listener
    refreshButton = document.getElementById('refresh');
    refreshButton.addEventListener('click', function () {
        computeResult();
        refreshResult();
    });

    // Get reset button and add listener
    resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', function () {
        reset();
        refreshResult(true);
    });

    // Get "autres" buttons and add listeners
    addOtherDepenseBtn = document.getElementById('add-depense-button');
    addOtherRecetteBtn = document.getElementById('add-recette-button');
    addOtherDepenseBtn.addEventListener('click', function () { onAddOtherBtnClick('depense'); });
    addOtherRecetteBtn.addEventListener('click', function () { onAddOtherBtnClick('recette'); });

    // Get "autres" wrappers
    depensesOtherWrapper = document.getElementById('other-depenses-wrapper');
    recettesOtherWrapper = document.getElementById('other-recettes-wrapper');

    // Get result total spans
    depensesResultTotalSpan = document.querySelector('#depenses h2 span.total');
    recettesResultTotalSpan = document.querySelector('#recettes h2 span.total');
    epargneResultTotalSpan = document.querySelector('#epargne h2 span.total');
    resultResultTotalSpan = document.querySelector('#result h2 span.total');

    // Initial compute & refresh in case of
    // default input values set in the HTML
    computeResult();
    refreshResult(true);
}


/**
 * Compute result
 */
function computeResult() {
    // Reset to 0
    depensesResult = 0;
    recettesResult = 0;
    epargneResult = 0;

    // Compute depenses
    for (let i = 0; i < depensesInputs.length; i++) {
        const element = depensesInputs[i];

        // Get the value and unforce number type
        let val = +element.value;

        // Check if there is a multiply attribute to multiply the value by
        const multiply = element.getAttribute('multiply');
        if (multiply) {
            val *= multiply;
        }

        depensesResult += val;
    }

    // Compute recettes
    for (let i = 0; i < recettesInputs.length; i++) {
        const element = recettesInputs[i];
        let val = +element.value;
        recettesResult += val;
    }

    // Compute epargne
    for (let i = 0; i < epargneInputs.length; i++) {
        const element = epargneInputs[i];
        let val = +element.value;
        epargneResult += val;
    }

    // Compute budget result and round it to 2 decimals
    resultatBudget = Math.round((recettesResult - depensesResult - epargneResult) * 100) / 100;
}


/**
 * Refresh results on page
 * 
 * doNotUpdateMessage (boolean):
 *      If true, the budget result message
 *      won't be displayed.
 */
function refreshResult(doNotUpdateMessage) {
    depensesResultTotalSpan.innerHTML = depensesResult + '€';
    recettesResultTotalSpan.innerHTML = recettesResult + '€';
    epargneResultTotalSpan.innerHTML = epargneResult + '€';
    resultResultTotalSpan.innerHTML = resultatBudget + '€';

    // Update budget message
    if (!doNotUpdateMessage) {
        if (resultatBudget < 0) {
            // If budget negative
            messageEl.innerHTML = 'Budget negatif !..';
            messageEl.setAttribute('class', 'negative');
            resultResultTotalSpan.setAttribute('class', 'negative');

        } else if (resultatBudget == 0) {
            // If budget null
            messageEl.innerHTML = 'Budget tout juste, prudence !';
            messageEl.setAttribute('class', 'neutral');
            resultResultTotalSpan.setAttribute('class', 'neutral');

        } else {
            // If budget positive
            messageEl.innerHTML = 'Budget positif !';
            messageEl.setAttribute('class', 'positive');
            resultResultTotalSpan.setAttribute('class', 'positive');

            // Propose based on result
            messageEl.innerHTML += '<br>';
            if (resultatBudget < 25) {
                messageEl.innerHTML += 'Vous pouvez vous faire plaisir à la boulangerie !';
            } else if (resultatBudget >= 25 && resultatBudget < 150) {
                messageEl.innerHTML += 'Est-ce qu\'on s\'achèterait pas un petit jeux-video ?';
            } else if (resultatBudget >= 150 && resultatBudget < 250) {
                messageEl.innerHTML += 'C\'est le moment de s\'offrir un vélo tout neuf !';
            } else if (resultatBudget >= 250 && resultatBudget < 500) {
                messageEl.innerHTML += 'Mon smartphone commence à se faire vieux !';
            } else if (resultatBudget >= 500 && resultatBudget < 1000) {
                messageEl.innerHTML += 'Une petite semaine à Disney ne ferait pas d\'mal.';
            } else if (resultatBudget >= 1000 && resultatBudget < 2000) {
                messageEl.innerHTML += 'Un ordinateur flambant neuf, ça doit se trouver dans ce budget.';
            } else if (resultatBudget >= 2000) {
                messageEl.innerHTML += 'Je peux m\'acheter une voiture tous les mois, elle est pas belle la vie ?!';
            }
        }
    }
}


/**
 * Iterate throw each inputs arrays and clear the value
 */
function reset() {
    depensesResult = 0;
    recettesResult = 0;
    epargneResult = 0;
    resultatBudget = 0;

    for (let i = 0; i < depensesInputs.length; i++) {
        depensesInputs[i].value = null;
    }
    for (let i = 0; i < recettesInputs.length; i++) {
        recettesInputs[i].value = null;
    }
    for (let i = 0; i < epargneInputs.length; i++) {
        epargneInputs[i].value = null;
    }

    // Clear message
    messageEl.innerHTML = '';

    // Remove others fields
    depensesOtherWrapper.innerHTML = '';
    recettesOtherWrapper.innerHTML = '';
}


/**
 * Function called when we click on "autre" add button
 * 
 * type (string):
 *      Either 'depense' or 'recette', defines where
 *      the new field will be inserted.
 */
function onAddOtherBtnClick(type) {
    // Increment others fields count
    othersCounts[type]++;

    const inputId = 'input-autre-' + type + '-' + othersCounts[type];

    // Prompt for field name
    const name = window.prompt('Nom ?')

    // Create field
    const newField = document.createElement('div');
    newField.setAttribute('class', 'field');

    // Append label if name provided
    if (name && name.length > 0) {
        const label = document.createElement('label');
        label.setAttribute('for', inputId);
        label.appendChild(document.createTextNode(name));
        newField.appendChild(label);
    }

    // Create input element and set attributes
    const input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('id', inputId);
    input.setAttribute('placeholder', '0,00');

    newField.appendChild(input);

    // Append euro symbol
    newField.appendChild(document.createTextNode(' €'));

    // Push the newly created field in the appropriate
    // array and append to wrapper
    if (type == 'depense') {
        depensesInputs.push(input);
        depensesOtherWrapper.appendChild(newField);

    } else if (type == 'recette') {
        recettesInputs.push(input);
        recettesOtherWrapper.appendChild(newField);
    }
}
