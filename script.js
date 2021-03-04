
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