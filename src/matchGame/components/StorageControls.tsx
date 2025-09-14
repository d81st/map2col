import React from "react";
import styled from "styled-components";
import { useStorageControls } from "../hooks/useStorageControls";
import { type Connection } from "../utils/types";

type StorageControlsProps = {
  connections: Connection[];
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
};

export const StorageControls: React.FC<StorageControlsProps> = ({
  connections,
  setConnections,
}) => {
  const { handleSave, handleRestore, handleClear } = useStorageControls(
    connections,
    setConnections
  );

  return (
    <Container>
      <Button onClick={handleSave}>💾 Сохранить</Button>
      <Button onClick={handleRestore}>🔄 Восстановить</Button>
      <Button onClick={handleClear}>🗑 Очистить</Button>
    </Container>
  );
};

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
