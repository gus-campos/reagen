"use client";

import React, { useState } from "react";
import {
  AppShell,
  Box,
  Button,
  Drawer,
  Grid,
  Modal,
  Paper,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Definition } from "@/src/models/definition";
import { Reagent } from "../../models/reagent";
import { ReagentsFilter } from "../../models/reagents-filter";
import { useData } from "../../providers/DataProvider";
import {
  uploadAddReagent,
  uploadDeleteReagent,
  uploadEditReagent,
} from "../../services/reagentsDB";
import { filteredReagent } from "../../utils/filtered-reagent";
import { formattedAmount } from "../../utils/formatted-amount";
import { formattedDate } from "../../utils/formatted-date";
import { normalizedAmount } from "../../utils/normalized-amount";
import { FilterOptions } from "../Crud/Filter/FilterOptions";
import {
  CrudOperations,
  TableCollumn,
  TableView,
} from "../Crud/Table/TableView";
import { ReagentEdit } from "./ReagentModal";
import { DataEdit } from "../Crud/Table/Modal/DataShowEdit";

const initialFilter: ReagentsFilter = {
  expired: null,
  minDate: null,
  maxDate: null,
  dimension: null,
  minAmount: null,
  maxAmount: null,
};

export function ReagentsPage() {
  const { reagents, getDefinitionById } = useData();
  const [
    reagentDrawerOpened,
    { open: openReagentDrawer, close: closeReagentDrawer },
  ] = useDisclosure(false);
  const [
    reagentModalOpened,
    { open: openReagentModal, close: closeReagentModal },
  ] = useDisclosure(false);
  const [selectedReagent, setSelectedReagent] = useState<Reagent | null>(null);
  const [showMode, { open: activateShowMode, close: deactivateShowMode }] =
    useDisclosure(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ReagentsFilter>(initialFilter);
  const [definition, setDefinition] = useState<Definition | null>(null);

  const handleClickRow = () => {
    openReagentDrawer();
  };

  const handleSearchChange = (search: string) => {
    setSearch(search);
  };

  const handleFilterChange = (filter: ReagentsFilter) => {
    setFilter(filter);
  };

  const handleBeginReagentAddition = () => {
    setSelectedReagent(null);
    deactivateShowMode();
    openReagentModal();
  };

  const handleShowReagent = (reagent: Reagent) => {
    setSelectedReagent(reagent);
    activateShowMode();
    openReagentDrawer();
  };

  const handleBeginReagentEdit = (reagent: Reagent) => {
    setSelectedReagent(reagent);
    deactivateShowMode();
    openReagentModal();
  };

  const handleAddReagent = (reagent: Reagent) => {
    uploadAddReagent(reagent);
    closeReagentModal();
  };

  const handleEditReagent = (reagent: Reagent) => {
    uploadEditReagent(reagent);
    closeReagentModal();
  };

  const handleDeleteReagent = (reagent: Reagent) => {
    uploadDeleteReagent(reagent);
  };

  const handleChangeDefinition = (definition: Definition | null) => {
    setDefinition(definition);
  };

  const crudOperations: CrudOperations<Reagent> = {
    handleShowData: handleShowReagent,
    handleBeginDataEdit: handleBeginReagentEdit,
    handleDeleteData: handleDeleteReagent,
  };

  const initialCollumns: TableCollumn<Reagent>[] = [
    {
      name: "Definição",
      accessor: (reagent: Reagent) =>
        getDefinitionById(reagent.definitionId)?.name ?? "ND",
      hidden: false,
      fixed: true,
      ascending: false,
      sorter: (a: Reagent, b: Reagent) =>
        (getDefinitionById(a.definitionId)?.name ?? "")
          .trim()
          .localeCompare(
            (getDefinitionById(b.definitionId)?.name ?? "").trim()
          ),
      sortingPriority: 0,
    },
    {
      name: "Quantidade",
      accessor: (reagent: Reagent) => formattedAmount(reagent),
      hidden: false,
      fixed: false,
      ascending: null,
      sorter: (a: Reagent, b: Reagent) =>
        normalizedAmount(a) - normalizedAmount(b),
      sortingPriority: null,
    },
    {
      name: "Pureza",
      accessor: (reagent: Reagent) =>
        reagent.purity ? `${reagent.purity} %` : "",
      hidden: false,
      fixed: false,
      ascending: null,
      sorter: (a: Reagent, b: Reagent) => a.purity - b.purity,
      sortingPriority: null,
    },
    {
      name: "Vencimeto",
      accessor: (reagent: Reagent) => formattedDate(reagent.expireDate),
      hidden: false,
      fixed: false,
      ascending: null,
      sorter: (a: Reagent, b: Reagent) =>
        (a.expireDate?.getTime() ?? Infinity) -
        (b.expireDate?.getTime() ?? Infinity),
      sortingPriority: null,
    },
  ];

  return (
    <>
      <h1>Reagentes</h1>
      <Grid>
        <Grid.Col span={{ base: 3 }}>
          <FilterOptions
            search={search}
            filter={filter}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onDefinitionChange={handleChangeDefinition}
            definition={definition}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 9 }}>
          <Box w={"100%"}>
            <TableView
              datas={reagents}
              initialCollumns={initialCollumns}
              search={search}
              searched={(reagent: Reagent) =>
                getDefinitionById(reagent.definitionId)?.name ?? ""
              }
              dataFilter={(reagent: Reagent) =>
                filteredReagent(reagent, filter)
              }
              crudOperations={crudOperations}
              handleClickRow={handleClickRow}
            />
          </Box>
        </Grid.Col>
      </Grid>

      <Button
        style={{ position: "fixed", bottom: "30px", right: "30px" }}
        onClick={handleBeginReagentAddition}
      >
        +
      </Button>

      <Drawer
        opened={reagentDrawerOpened}
        onClose={closeReagentDrawer}
        overlayProps={{ backgroundOpacity: 0.1, blur: 0 }}
        position="right"
      >
        <Tabs defaultValue="overview">
          <Tabs.List>
            <Tabs.Tab value="overview">Visão geral</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="overview">IMPLEMENTAR OVERVIEW</Tabs.Panel>
        </Tabs>
      </Drawer>

      <Modal
        title={
          <strong>
            {selectedReagent ? `Editar reagente` : `Adicionar reagente`}
          </strong>
        }
        opened={reagentModalOpened}
        onClose={closeReagentModal}
      >
        <ReagentEdit
          showMode={showMode}
          selectedReagent={selectedReagent}
          reagentModalOpened={reagentModalOpened}
          onCloseReagentModal={closeReagentModal}
          onAddReagent={handleAddReagent}
          onEditReagent={handleEditReagent}
          onBeginShownReagentEdit={
            selectedReagent
              ? () => handleBeginReagentEdit(selectedReagent)
              : () => {}
          }
        />
      </Modal>
    </>
  );
}
