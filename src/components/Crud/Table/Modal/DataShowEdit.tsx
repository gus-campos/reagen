import React, { ReactNode, useEffect } from "react";
import { Box, Button, Group, Modal } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type ReagentModalProps<T> = {
  showMode: boolean;
  selectedData: T | null;
  children: ReactNode;
  dataName: string;
  form: UseFormReturnType<T>;
  onCloseModal: () => void;
  onAddData: (data: T) => void;
  onEditData: (selectedData: T) => void;
  onBeginShownDataEdit: () => void;
};

export function DataEdit<T>(props: ReagentModalProps<T>) {
  const handleSubmit = (data: T) => {
    props.onCloseModal();

    if (props.selectedData) props.onEditData(data);
    else props.onAddData(data);
    props.form.reset();
  };

  useEffect(() => {
    if (props.selectedData) props.form.setValues(props.selectedData);
    else props.form.reset();
  }, [props.selectedData]);

  return (
    <Box>
      {<form>{props.children}</form>}
      <Group mt="xl" justify="right">
        <Button
          onClick={() => {
            props.form.onSubmit(handleSubmit)();
          }}
        >
          {props.selectedData ? "Salvar" : "Adicionar"}
        </Button>

        <Button variant="outline" onClick={props.onCloseModal}>
          Cancelar
        </Button>
      </Group>
    </Box>
  );
}
