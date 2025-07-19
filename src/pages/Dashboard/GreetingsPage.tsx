import { useTranslation } from 'react-i18next';
import { useGreetings } from './useGreetings';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Link } from 'react-router-dom';

export default function GreetingsPage() {
  const { t } = useTranslation();
  const {
    greetings, loading, error, form, setForm, formLoading, formError,
    handleSubmit, handleEdit, handleDelete
  } = useGreetings(t);

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow relative text-black">
      <div className="mb-6 flex gap-4">
        <Link to="/dashboard">
          <Button variant="secondary">{t('backToMenu')}</Button>
        </Link>
        <Link to="/profile">
          <Button variant="primary">{t('profile')}</Button>
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-4">{t('greetings')}</h2>
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <Input
          placeholder={t('greetings')}
          value={form.text}
          onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
          required
        />
        {formError && <div className="text-red-500 text-sm">{formError}</div>}
        <div className="flex gap-2">
          <Button type="submit" disabled={formLoading}>
            {form.id ? t('edit') : t('createBot')}
          </Button>
          {form.id && (
            <Button type="button" variant="secondary" onClick={() => setForm({ text: '' })}>
              {t('cancel')}
            </Button>
          )}
        </div>
      </form>
      <div className="relative">
        <ul className="space-y-2">
          {greetings.length > 0 ? greetings.map(g => (
            <li key={g.id} className="flex justify-between items-center bg-white p-3 rounded text-black">
              <span>{g.text}</span>
              <div className="flex gap-2">
                <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={() => handleEdit(g)}>{t('edit')}</button>
                <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleDelete()}>{t('delete')}</button>
              </div>
            </li>
          )) : <li className="text-gray-400 text-center py-4">{t('noData')}</li>}
        </ul>
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 text-lg text-blue-600">
            <svg className="animate-spin h-6 w-6 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            {t('loading')}
          </div>
        )}
      </div>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
} 