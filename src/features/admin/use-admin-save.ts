"use client";

import { useState } from "react";

export function useAdminSave() {
  const [notice, setNotice] = useState({ message: "", error: false });

  function save(update: () => void, message = "Изменения сохранены") {
    try {
      update();
      setNotice({ message, error: false });
      return true;
    } catch (error) {
      setNotice({
        message: error instanceof AdminValidationError ? error.message : "Не удалось сохранить. Проверьте, доступно ли хранилище браузера.",
        error: true,
      });
      return false;
    }
  }

  return { notice, save };
}

export class AdminValidationError extends Error {}
