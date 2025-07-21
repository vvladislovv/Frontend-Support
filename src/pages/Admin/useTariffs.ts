import { useState, useEffect, useCallback } from 'react';
import { getTariffs, createTariff, updateTariff, deleteTariff } from '../../api';
import type { Tariff } from '../../types';

interface UseTariffsReturn {
  tariffs: Tariff[];
  loading: boolean;
  error: string;
  showModal: boolean;
  openModal: (tariff?: Tariff) => void;
  closeModal: () => void;
  editTariff: Tariff | null;
  form: {
    name: string;
    price: number;
    description: string;
    active: boolean;
    features: string;
  };
  setForm: React.Dispatch<React.SetStateAction<{
    name: string;
    price: number;
    description: string;
    active: boolean;
    features: string;
  }>>;
  formLoading: boolean;
  formError: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string | number | boolean } }) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleDelete: (id: string) => void;
  refreshData: () => void;
}
import throttle from 'lodash.throttle';

export function useTariffs(t: (key: string) => string): UseTariffsReturn {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTariff, setEditTariff] = useState<Tariff | null>(null);
  const [form, setForm] = useState({
    name: '',
    price: 0,
    description: '',
    active: true,
    features: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchTariffs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const tariffsData = await getTariffs();
      setTariffs(tariffsData);
    } catch {
      setError(t('errorLoadingData'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchTariffs();
  }, [fetchTariffs]);

  const openModal = (tariff?: Tariff) => {
    setEditTariff(tariff || null);
    setForm(tariff ? {
      name: tariff.name,
      price: tariff.price,
      description: tariff.description,
      active: tariff.active,
      features: tariff.features.join(', ')
    } : {
      name: '',
      price: 0,
      description: '',
      active: true,
      features: ''
    });
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditTariff(null);
    setFormError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string | number | boolean } }) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const throttledSubmit = throttle(async (event: React.FormEvent) => {
    event.preventDefault();
    setFormLoading(true);
    setFormError('');
    
    try {
      const tariffData = {
        name: form.name,
        price: Number(form.price),
        description: form.description,
        active: form.active,
        features: form.features.split(',').map(f => f.trim()).filter(f => f)
      };

      if (editTariff) {
        await updateTariff(editTariff.id, tariffData);
      } else {
        await createTariff(tariffData);
      }
      
      closeModal();
      fetchTariffs();
    } catch {
      setFormError(t('errorSavingData'));
    } finally {
      setFormLoading(false);
    }
  }, 2000, { trailing: false });

  const handleSubmit = (event: React.FormEvent) => throttledSubmit(event);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('confirmDelete'))) return;
    
    try {
      await deleteTariff(id);
      fetchTariffs();
    } catch {
      setError(t('errorDeletingData'));
    }
  };

  return {
    tariffs,
    loading,
    error,
    showModal,
    openModal,
    closeModal,
    editTariff,
    form,
    setForm,
    formLoading,
    formError,
    handleChange,
    handleSubmit,
    handleDelete,
    refreshData: fetchTariffs
  };
}