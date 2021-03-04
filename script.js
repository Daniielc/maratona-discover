
const Modal = {
    open() {
        // Abrir modal
        //Adicionar a class active do modal-overlay
        document
            .querySelector('.modal-overlay')
            .classList.add('active')
    },
    close() {
        // Fechar modal
        //Romver a class active do modal-overlay
        document
            .querySelector('.modal-overlay')
            .classList.remove('active')
    }
}

const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -50000,
        date: '04/03/2021'
    },
    {
        id: 2,
        description: 'Água',
        amount: -15000,
        date: '04/03/2021'
    },
    {
        id: 3,
        description: 'Água',
        amount: 500000,
        date: '04/03/2021'
    },
    {
        id: 4,
        description: 'Internet',
        amount: -20000,
        date: '04/03/2021'
    }
]

const DOM = {
    transactionMapper() {
        transactions.map(trans => {
            DOM.addTransaction(trans);
        })
    },
    transactionContainer: document.querySelector("#data-table tbody"),
    addTransaction(transaction) {
        const tr = document.createElement("tr");
        tr.innerHTML = this.innerHTMLTransaction(transaction);

        DOM.transactionContainer.appendChild(tr);
    },
    innerHTMLTransaction(transaction) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense";
        const amount = Utils.formatCurrency(transaction.amount)
        return `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img src="./assets/minus.svg" alt="Remover Transação"></td>
        `
    },
    updateBalance() {
        document.getElementById("incomeDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.incomes());
        document.getElementById("expenseDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.expenses());
        document.getElementById("totalDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.total());
    }
}

const Transaction = {
    incomes() {
        // somar as entradas
        let income = 0;
        transactions.map(trans => {
            if (trans.amount > 0)
                income += trans.amount;
        });

        return income;
    },
    expenses() {
        // somar as saídas
        let expense = 0;

        transactions.map(trans => {
            if (trans.amount < 0)
                expense += trans.amount;
        });

        return expense;
    },
    total() {
        return Transaction.incomes() + Transaction.expenses();
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "- " : " ";

        value = String(value).replace(/\D/g, "");
        value = Number(value) / 100;
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return (signal + value)
    }
}

DOM.transactionMapper();
DOM.updateBalance();