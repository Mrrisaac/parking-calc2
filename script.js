document.getElementById('calculator-form').addEventListener('submit', function (e) {
    e.preventDefault();
    calculateCharges();
});

// Ensure only one oversized vehicle checkbox can be selected
const oversizedCheckboxes = document.querySelectorAll('.oversized');
oversizedCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            oversizedCheckboxes.forEach(cb => {
                if (cb !== this) cb.checked = false;
            });
        }
    });
});

function calculateCharges() {
    // Get input values
    const monthlyRate = parseFloat(document.getElementById('monthly-rate').value) || 0;
    const lastMonthRate = parseFloat(document.getElementById('last-month-rate').value) || 0;
    const startDate = new Date(document.getElementById('start-date').value);
    const briarHillTax = document.getElementById('briar-hill-tax').checked;
    const oversized84 = document.getElementById('oversized-84').checked;
    const oversized105 = document.getElementById('oversized-105').checked;
    const excludeLastMonth = document.getElementById('exclude-last-month').checked;

    // Determine tax rate
    const taxRate = briarHillTax ? 0.10375 : 0.18375;

    // Calculate prorate based on start date
    let proratedAmount = 0;
    if (startDate) {
        const dayOfMonth = startDate.getDate();
        if (dayOfMonth >= 2) {
            const daysRemaining = 30 - (dayOfMonth - 1);
            proratedAmount = (monthlyRate * daysRemaining) / 30;
        }
    }

    // Oversized vehicle surcharge
    let oversizedSurcharge = 0;
    if (oversized84) oversizedSurcharge = 84.48;
    if (oversized105) oversizedSurcharge = 105.60;

    // Calculate taxed amounts
    const monthlyTax = monthlyRate * taxRate;
    const monthlyWithTax = Math.round(monthlyRate + monthlyTax);

    const lastMonthTax = lastMonthRate * taxRate;
    const lastMonthWithTax = excludeLastMonth ? 0 : Math.round(lastMonthRate + lastMonthTax);

    const proratedTax = proratedAmount * taxRate;
    const proratedWithTax = proratedAmount + proratedTax;

    const oversizedTax = oversizedSurcharge * taxRate;
    const oversizedWithTax = oversizedSurcharge + oversizedTax;

    // Calculate total
    const totalWithTax = monthlyWithTax + lastMonthWithTax + proratedWithTax + oversizedWithTax;

    // Populate table
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    // Monthly Rate
    tableBody.innerHTML += `
        <tr>
            <td>Monthly Rate</td>
            <td>$${monthlyRate.toFixed(2)}</td>
            <td>$${monthlyTax.toFixed(2)}</td>
            <td>$${monthlyWithTax.toFixed(2)}</td>
        </tr>
    `;

    // Last Month Rate (if not excluded)
    if (!excludeLastMonth) {
        tableBody.innerHTML += `
            <tr>
                <td>Last Month Rate</td>
                <td>$${lastMonthRate.toFixed(2)}</td>
                <td>$${lastMonthTax.toFixed(2)}</td>
                <td>$${lastMonthWithTax.toFixed(2)}</td>
            </tr>
        `;
    }

    // Prorated Amount (only if > 0)
    if (proratedAmount > 0) {
        tableBody.innerHTML += `
            <tr>
                <td>Prorated Amount</td>
                <td>$${proratedAmount.toFixed(2)}</td>
                <td>$${proratedTax.toFixed(2)}</td>
                <td>$${proratedWithTax.toFixed(2)}</td>
            </tr>
        `;
    }

    // Oversized Surcharge (if applicable)
    if (oversizedSurcharge > 0) {
        tableBody.innerHTML += `
            <tr>
                <td>Oversized Surcharge</td>
                <td>$${oversizedSurcharge.toFixed(2)}</td>
                <td>$${oversizedTax.toFixed(2)}</td>
                <td>$${oversizedWithTax.toFixed(2)}</td>
            </tr>
        `;
    }

    // Update total
    document.getElementById('total-with-tax').textContent = `$${totalWithTax.toFixed(2)}`;

    // Show table
    document.getElementById('result-table').style.display = 'table';
}
