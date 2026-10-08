// Get HTML elements

const transactionForm =
    document.getElementById("transactionForm");

const descriptionInput =
    document.getElementById("description");

const amountInput =
    document.getElementById("amount");

const typeInput =
    document.getElementById("type");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const transactionList =
    document.getElementById("transactionList");

const balanceElement =
    document.getElementById("balance");

const incomeElement =
    document.getElementById("income");

const expenseElement =
    document.getElementById("expense");

const searchInput =
    document.getElementById("search");

const filterType =
    document.getElementById("filterType");

const filterCategory =
    document.getElementById("filterCategory");


// Set today's date

const today =
    new Date().toISOString().split("T")[0];

dateInput.value = today;


// Load transactions from LocalStorage

let transactions =
    JSON.parse(
        localStorage.getItem("transactions")
    ) || [];


// Add Transaction

transactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const description =
            descriptionInput.value.trim();

        const amount =
            parseFloat(amountInput.value);

        const type =
            typeInput.value;

        const category =
            categoryInput.value;

        const date =
            dateInput.value;


        // Validate input

        if (
            description === "" ||
            isNaN(amount) ||
            amount <= 0 ||
            type === "" ||
            category === "" ||
            date === ""
        ) {

            alert(
                "Please fill all fields correctly."
            );

            return;
        }


        // Create transaction

        const transaction = {

            id: Date.now(),

            description: description,

            amount: amount,

            type: type,

            category: category,

            date: date

        };


        // Add transaction to array

        transactions.push(transaction);


        // Save data

        saveTransactions();


        // Display data

        displayTransactions();


        // Update summary

        updateSummary();


        // Clear form

        transactionForm.reset();


        // Set today's date again

        dateInput.value = today;

    }
);


// Save transactions

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// Display transactions

function displayTransactions() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedType =
        filterType.value;

    const selectedCategory =
        filterCategory.value;


    // Filter transactions

    const filteredTransactions =
        transactions.filter(
            function (transaction) {

                const matchesSearch =
                    transaction.description
                        .toLowerCase()
                        .includes(searchText);


                const matchesType =
                    selectedType === "all" ||
                    transaction.type === selectedType;


                const matchesCategory =
                    selectedCategory === "all" ||
                    transaction.category === selectedCategory;


                return (
                    matchesSearch &&
                    matchesType &&
                    matchesCategory
                );

            }
        );


    // Clear previous list

    transactionList.innerHTML = "";


    // No transaction

    if (
        filteredTransactions.length === 0
    ) {

        transactionList.innerHTML =
            `
            <p class="empty-message">
                No transactions found.
            </p>
            `;

        return;
    }


    // Display transactions

    filteredTransactions
        .slice()
        .reverse()
        .forEach(
            function (transaction) {

                const transactionElement =
                    document.createElement("div");


                transactionElement.className =
                    `transaction ${
                        transaction.type
                    }-transaction`;


                const sign =
                    transaction.type === "income"
                        ? "+"
                        : "-";


                const amountClass =
                    transaction.type === "income"
                        ? "income-text"
                        : "expense-text";


                transactionElement.innerHTML =
                    `
                    <div class="transaction-info">

                        <h3>
                            ${escapeHTML(
                                transaction.description
                            )}
                        </h3>

                        <p>
                            📂 ${transaction.category}
                        </p>

                        <p>
                            📅 ${formatDate(
                                transaction.date
                            )}
                        </p>

                    </div>


                    <div
                        class="transaction-amount
                        ${amountClass}"
                    >
                        ${sign} ₹${transaction.amount.toFixed(2)}
                    </div>


                    <button
                        class="delete-btn"
                        onclick="deleteTransaction(
                            ${transaction.id}
                        )"
                    >
                        Delete
                    </button>
                    `;


                transactionList.appendChild(
                    transactionElement
                );

            }
        );

}


// Update summary

function updateSummary() {

    let totalIncome = 0;

    let totalExpense = 0;


    transactions.forEach(
        function (transaction) {

            if (
                transaction.type === "income"
            ) {

                totalIncome +=
                    transaction.amount;

            } else {

                totalExpense +=
                    transaction.amount;

            }

        }
    );


    const balance =
        totalIncome - totalExpense;


    incomeElement.textContent =
        `₹${totalIncome.toFixed(2)}`;


    expenseElement.textContent =
        `₹${totalExpense.toFixed(2)}`;


    balanceElement.textContent =
        `₹${balance.toFixed(2)}`;

}


// Delete transaction

function deleteTransaction(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmDelete) {
        return;
    }


    transactions =
        transactions.filter(
            function (transaction) {

                return transaction.id !== id;

            }
        );


    saveTransactions();

    displayTransactions();

    updateSummary();

}


// Format date

function formatDate(date) {

    const dateObject =
        new Date(date + "T00:00:00");


    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// Prevent HTML injection

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// Search

searchInput.addEventListener(
    "input",
    displayTransactions
);


// Filter by type

filterType.addEventListener(
    "change",
    displayTransactions
);


// Filter by category

filterCategory.addEventListener(
    "change",
    displayTransactions
);


// Initial display

displayTransactions();

updateSummary();