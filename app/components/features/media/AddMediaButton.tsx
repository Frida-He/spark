'use client';

import { useState } from 'react';
import FloatingActionButton from '../../common/FloatingActionButton';
import Modal from '../../common/Modal';
import AddMediaForm from './AddMediaForm';

export default function AddMediaButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <FloatingActionButton onClick={() => setIsModalOpen(true)} />
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="添加内容"
      >
        <AddMediaForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </>
  );
} 