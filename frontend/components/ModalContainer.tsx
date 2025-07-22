import Modal from "./Modal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useModal } from "@/context/ModalContext";

const ModalContainer = () => {
    const { modalType, closeModal } = useModal();

    return (
        <Modal isOpen={!!modalType} onClose={closeModal}>
            {modalType === 'login' && <LoginForm />}
            {modalType === 'register' && <RegisterForm />}
        </Modal>
    );
};

export default ModalContainer;