import { useBots } from "./useBots";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { Table } from "../../components/common/Table";
import { Link } from "react-router-dom";
import MobileHeader from "../../components/MobileHeader";
import { isTelegramWebApp } from "../../telegram";
import { useTranslation } from "react-i18next";

const BotsPage: React.FC = () => {
  const {
    bots,
    loading,
    error,
    showModal,
    openModal,
    closeModal,
    editBot,
    form,
    formLoading,
    formError,
    handleChange,
    handleSubmit,
    handleDelete,
  } = useBots();

  const { t } = useTranslation();
  const isMobile = window.innerWidth <= 768 || isTelegramWebApp();

  if (isMobile) {
    return (
      <div className="min-h-screen tg-bg">
        <MobileHeader title={t("bots")} fullWidth={true} />

        <div className="px-4 py-6 pb-32">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tg-text mb-2">🤖 {t("bots")}</h1>
            <p className="tg-hint text-sm">{t("botsDescription")}</p>
          </div>

          <div className="mb-6">
            <Button
              onClick={() => openModal()}
              className="w-full btn-primary-mobile"
            >
              {t("createBot")}
            </Button>
          </div>

          <div className="space-y-4">
            {bots.length > 0 ? (
              bots.map((bot) => (
                <div key={bot.id} className="card-mobile">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold tg-text">{bot.name}</h3>
                      <p className="text-sm tg-hint">@{bot.username}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">🤖</span>
                    </div>
                  </div>
                  <a
                    href={bot.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm underline block mb-3"
                  >
                    {bot.link}
                  </a>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(bot)}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium active:bg-blue-600 transition-colors"
                    >
                      ✏️ {t("edit")}
                    </button>
                    <button
                      onClick={() => handleDelete(bot.id)}
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium active:bg-red-600 transition-colors"
                    >
                      🗑️ {t("delete")}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="card-mobile text-center py-8">
                <div className="text-4xl mb-4">🤖</div>
                <p className="tg-hint">{t("noBots")}</p>
                <p className="text-sm tg-hint mt-1">{t("createFirstBot")}</p>
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
            <div className="card-mobile bg-red-50 border-red-200 mt-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Modal
            open={showModal}
            onClose={closeModal}
            title={editBot ? t("editBot") : t("createBot")}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="name"
                placeholder={t("botName")}
                value={form.name}
                onChange={handleChange}
                required
                className="input-mobile"
              />
              <Input
                name="token"
                placeholder={t("botToken")}
                value={form.token}
                onChange={handleChange}
                required
                className="input-mobile"
              />
              <Input
                name="username"
                placeholder={t("botUsername")}
                value={form.username}
                onChange={handleChange}
                required
                className="input-mobile"
              />
              <Input
                name="link"
                placeholder={t("botLink")}
                value={form.link}
                onChange={handleChange}
                required
                className="input-mobile"
              />
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
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow mt-12 relative text-black">
      <div className="mb-6 flex gap-4">
        <Link to="/dashboard">
          <Button variant="secondary">{t("backToMenu")}</Button>
        </Link>
        <Link to="/profile">
          <Button variant="primary">{t("profile")}</Button>
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-2 text-black">{t("bots")}</h2>
      <p className="text-gray-500 mb-6">{t("botsDescription")}</p>
      <div className="flex justify-end mb-4">
        <Button onClick={() => openModal()}>{t("createBot")}</Button>
      </div>
      <div className="relative">
        <Table
          columns={[
            { key: "name", label: t("botName") },
            { key: "username", label: t("botUsername") },
            { key: "link", label: t("botLink") },
          ]}
          data={
            bots.length > 0
              ? bots.map((bot) => ({
                  ...bot,
                  link: (
                    <a
                      href={bot.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {bot.link}
                    </a>
                  ),
                  actions: (
                    <div className="flex gap-2">
                      <Button
                        variant="warning"
                        onClick={() => openModal(bot)}
                        className="text-xs px-2 py-1"
                      >
                        ✏️ {t("edit")}
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(bot.id)}
                        className="text-xs px-2 py-1"
                      >
                        🗑️ {t("delete")}
                      </Button>
                    </div>
                  ),
                }))
              : [{ name: t("noData"), username: "", link: "", actions: "" }]
          }
          actions={
            bots.length > 0 ? (
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
        title={editBot ? t("editBot") : t("createBot")}
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            name="name"
            placeholder={t("botName")}
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="token"
            placeholder={t("botToken")}
            value={form.token}
            onChange={handleChange}
            required
          />
          <Input
            name="username"
            placeholder={t("botUsername")}
            value={form.username}
            onChange={handleChange}
            required
          />
          <Input
            name="link"
            placeholder={t("botLink")}
            value={form.link}
            onChange={handleChange}
            required
          />
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

export default BotsPage;
