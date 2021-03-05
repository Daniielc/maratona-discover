
const Modal = {
    open() {
        // Abrir modal
        //Adicionar a class active do modal-overlay
        document
            .querySelector('.modal-overlay')
            .classList.toggle('active')
    },
    close() {
        // Fechar modal
        //Romver a class active do modal-overlay
        document
            .querySelector('.modal-overlay')
            .classList.toggle('active')
    }
}

const DOM = {
    transactionMapper() {
        Transaction.all.map(trans => {
            DOM.addTransaction(trans);
        })
    },
    transactionContainer: document.querySelector("#data-table tbody"),
    addTransaction(transaction, index) {
        const tr = document.createElement("tr");
        tr.innerHTML = this.innerHTMLTransaction(transaction, index);
        tr.dataset.index = index;

        DOM.transactionContainer.appendChild(tr);
    },
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense";
        const amount = Utils.formatCurrency(transaction.amount)
        return `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td><img onclick="Transaction.del(${index})" src="./assets/minus.svg" alt="Remover Transação"></td>
        `
    },
    updateBalance() {
        document.getElementById("incomeDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.incomes());
        document.getElementById("expenseDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.expenses());
        document.getElementById("totalDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.total());
    },
    clearTransaction() {
        DOM.transactionContainer.innerHTML = "";
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transaction) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transaction))
    }
}

const Transaction = {
    all: Storage.get(),
    add(transaction) {
        Transaction.all.push(transaction);

        App.reload();
    },
    del(index) {
        Transaction.all.splice(index, 1);

        App.reload();
    },
    incomes() {
        // somar as entradas
        let income = 0;
        Transaction.all.map(trans => {
            if (trans.amount > 0)
                income += trans.amount;
        });

        return income;
    },
    expenses() {
        // somar as saídas
        let expense = 0;

        Transaction.all.map(trans => {
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
    },
    formatAmount(value) {
        value = Number(value) * 100
        return Math.round(value);
    },
    formatDate(value) {
        const splittedDate = value.split("-");
        return `${splittedDate[2]} / ${splittedDate[1]} / ${splittedDate[0]}`
    },
    formatDescriptin(value) {
        console.log(value);
    }
}

const Form = {
    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    validateField() {
        let { description, amount, date } = Form.getValues();

        if (description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
            throw new Error("Por favor preencha todos os campos.")
        }
    },
    formatData() {
        let { description, amount, date } = Form.getValues();

        amount = Utils.formatAmount(amount);
        date = Utils.formatDate(date);

        return {
            description,
            amount,
            date
        }

    },
    clearFields(transaction) {
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },
    submit(event) {
        event.preventDefault();

        try {
            // validando os campos
            Form.validateField();

            // formatando os dados
            const transactions = Form.formatData();

            // salvando os dados
            Transaction.add(transactions);

            // Limpando os campos
            Form.clearFields();

            // Fechando Modal
            Modal.close();

        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {
        DOM.transactionMapper();
        DOM.updateBalance();

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransaction();
        App.init();
    }
}

App.init();