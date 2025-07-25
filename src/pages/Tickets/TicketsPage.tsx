import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useTickets } from "./useTickets";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { Table } from "../../components/common/Table";
import { isTelegramWebApp } from "../../telegram";
import MobileHeader from "../../components/MobileHeader";

const TicketsPage: React.FC = () => {
  const { t } = useTranslation();
  const {
    tickets,
    loading,
    error,
    showModal,
    openModal,
    closeModal,
    editTicket,
    form,
    formLoading,
    formError,
    handleChange,
    handleSubmit,
    handleDelete,
  } = useTickets(t);

  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "text-green-600 bg-green-100";
      case "IN_PROGRESS":
        return "text-yellow-600 bg-yellow-100";
      case "CLOSED":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "OPEN":
        return "Открыт";
      case "IN_PROGRESS":
        return "В работе";
      case "CLOSED":
        return "Закрыт";
      default:
        return status;
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg">
        <MobileHeader title={t("tickets")} fullWidth={true} />

        <div className="px-4 py-6 pb-32">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tg-text mb-2">
              🎫 {t("tickets")}
            </h1>
            <p className="tg-hint text-sm">{t("ticketsDescription")}</p>
          </div>

          <div className="mb-6">
            <Button
              onClick={() => openModal()}
              className="w-full btn-primary-mobile"
            >
              {t("newTicket")}
            </Button>
          </div>

          <div className="space-y-4">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div key={ticket.id} className="card-mobile">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold tg-text mb-1">
                        {ticket.subject}
                      </h3>
                      <p className="text-sm tg-hint mb-2 line-clamp-2">
                        {ticket.message}
                      </p>
                      <p className="text-xs tg-hint">ID: {ticket.telegramId}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {getStatusText(ticket.status)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(ticket)}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium active:bg-blue-600 transition-colors"
                    >
                      ✏️ {t("edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(ticket.id)}
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium active:bg-red-600 transition-colors"
                    >
                      🗑️ {t("delete")}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="card-mobile text-center py-8">
                <div className="text-4xl mb-4">🎫</div>
                <p className="tg-hint">Нет тикетов</p>
                <p className="text-sm tg-hint mt-1">Создайте первый тикет</p>
              </div>
            )}
          </div>

          {loading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 flex items-center gap-3">
                <svg
                  className="animate-spin h-6 w-6 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
                <span className="text-lg text-blue-600">{t("loading")}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="text-gray-400 text-center py-8">{t('noData') || 'Нет данных (backend недоступен)'}</div>
          )}

          <Modal
            open={showModal}
            onClose={closeModal}
            title={editTicket ? t("editTicket") : t("newTicket")}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="subject"
                placeholder={t("ticketSubject")}
                value={form.subject}
                onChange={handleChange}
                required
                className="input-mobile"
              />
              <textarea
                name="message"
                placeholder={t("ticketMessage")}
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white text-black"
              />
              <Input
                name="telegramId"
                placeholder={t("telegramId")}
                value={form.telegramId}
                onChange={handleChange}
                required
                className="input-mobile"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black"
              >
                <option value="OPEN">Открыт</option>
                <option value="IN_PROGRESS">В работе</option>
                <option value="CLOSED">Закрыт</option>
              </select>
              {formError && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  {formError}
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeModal}
                  className="flex-1 btn-secondary-mobile"
                >
                  {t("cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 btn-primary-mobile"
                >
                  {formLoading ? t("saving") : t("save")}
                </Button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 text-black">
      <div className="mb-6 flex gap-4">
        <Link to="/dashboard">
          <Button variant="secondary">{t("backToMenu")}</Button>
        </Link>
      </div>

      <h2 className="text-2xl font-bold mb-2 text-black">{t("tickets")}</h2>
      <p className="text-gray-500 mb-6">{t("ticketsDescription")}</p>

      <div className="flex justify-end mb-4">
        <Button onClick={() => openModal()}>{t("newTicket")}</Button>
      </div>

      <div className="relative">
        <Table
          columns={[
            { key: "subject", label: t("ticketSubject") },
            { key: "message", label: t("ticketMessage") },
            { key: "telegramId", label: t("telegramId") },
            { key: "status", label: t("status") },
          ]}
          data={
            tickets.length > 0
              ? tickets.map((ticket) => ({
                  ...ticket,
                  message:
                    ticket.message.length > 50
                      ? ticket.message.substring(0, 50) + "..."
                      : ticket.message,
                  status: (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {getStatusText(ticket.status)}
                    </span>
                  ),
                  actions: (
                    <div className="flex gap-2">
                      <Button
                        variant="warning"
                        onClick={() => openModal(ticket)}
                        className="text-xs px-2 py-1"
                      >
                        ✏️ {t("edit")}
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(ticket.id)}
                        className="text-xs px-2 py-1"
                      >
                        🗑️ {t("delete")}
                      </Button>
                    </div>
                  ),
                }))
              : [
                  {
                    subject: t("noData"),
                    message: "",
                    telegramId: "",
                    status: "",
                    actions: "",
                  },
                ]
          }
          actions={
            tickets.length > 0 ? (
              <div className="flex gap-2">
                <Button
                  variant="warning"
                  onClick={() => openModal()}
                  className="text-xs px-2 py-1"
                >
                  ✏️
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {}}
                  className="text-xs px-2 py-1"
                >
                  🗑️
                </Button>
              </div>
            ) : null
          }
        />
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 text-lg text-blue-600">
            <svg
              className="animate-spin h-6 w-6 mr-2 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            {t("loading")}
          </div>
        )}
      </div>

      {error && <div className="text-red-500 mt-2">{error}</div>}

      <Modal
        open={showModal}
        onClose={closeModal}
        title={editTicket ? t("editTicket") : t("newTicket")}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            name="subject"
            placeholder={t("ticketSubject")}
            value={form.subject}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder={t("ticketMessage")}
            value={form.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
          <Input
            name="telegramId"
            placeholder={t("telegramId")}
            value={form.telegramId}
            onChange={handleChange}
            required
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="OPEN">Открыт</option>
            <option value="IN_PROGRESS">В работе</option>
            <option value="CLOSED">Закрыт</option>
          </select>
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" onClick={closeModal}>
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={formLoading}>
              {formLoading ? t("saving") : t("save")}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TicketsPage;
