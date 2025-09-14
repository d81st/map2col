import React from "react";
import {
  saveConnections,
  restoreConnections,
  clearConnections,
} from "../utils/storage";
import { type Connection } from "../utils/types";
import styled from "styled-components";

type StorageControlsProps = {
  connections: Connection[];
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
};

export function StorageControls({
  connections,
  setConnections,
}: StorageControlsProps) {
  const handleSave = () => {
    saveConnections(connections);
    alert("Сохранено!");
  };

  const handleRestore = () => {
    setConnections(restoreConnections());
    alert("Восстановлено!");
  };

  const handleClear = () => {
    clearConnections();
    setConnections([]);
    alert("Очищено!");
  };

  return (
    <Container>
      <Button onClick={handleSave}>💾 Сохранить</Button>
      <Button onClick={handleRestore}>🔄 Восстановить</Button>
      <Button onClick={handleClear}>🗑 Очистить</Button>
    </Container>
  );
}

const Button = styled.button`
  padding: 10px;
  border-radius: 0.5rem;
  border: 1px solid green;
  font-size: 1rem;
  cursor: pointer;
`;

const Container = styled.div`
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
`;
