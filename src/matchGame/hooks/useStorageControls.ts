import { useCallback } from "react";
import { type Connection } from "../utils/types";
import {
  saveConnections,
  restoreConnections,
  clearConnections,
} from "../utils/storage";

export function useStorageControls(
  connections: Connection[],
  setConnections: (c: Connection[]) => void
) {
  const notify = useCallback((msg: string) => {
    alert(msg);
  }, []);

  const handleSave = useCallback(() => {
    saveConnections(connections);
    notify("Сохранено!");
  }, [connections, notify]);

  const handleRestore = useCallback(() => {
    const restored = restoreConnections();
    setConnections(restored);
    notify("Восстановлено!");
  }, [setConnections, notify]);

  const handleClear = useCallback(() => {
    clearConnections();
    setConnections([]);
    notify("Очищено!");
  }, [setConnections, notify]);

  return {
    handleSave,
    handleRestore,
    handleClear,
  };
}
