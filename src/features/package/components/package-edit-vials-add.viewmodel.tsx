import { useState } from 'react';
import { useData } from '@/providers/data.provider';
import { PackageEditVialsAddProps } from '@/features/package/components/package-edit-vials-add.view';

export type LabGroup = { laboratoryId: string; amount: number };

export function usePackageEditVialsAdd(props: PackageEditVialsAddProps) {
  const { laboratories, getLaboratoryById } = useData();
  const [labIdToAdd, setLabIdToAdd] = useState<string | null>(null);

  const labGroupsWithNames = props.labGroups.map((group) => ({
    ...group,
    laboratoryName: getLaboratoryById(group.laboratoryId).name,
  }));

  const availableLaboratories =
    laboratories!
      .filter((lab) => !props.labGroups.map((g) => g.laboratoryId).includes(lab.id))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((lab) => ({
        value: lab.id,
        label: lab.name,
      })) ?? [];

  const handleAddLabGroup = () => {
    if (labIdToAdd) {
      props.onChangeLabGroups([...props.labGroups, { laboratoryId: labIdToAdd, amount: 1 }]);
      setLabIdToAdd(null);
    }
  };

  const handleLabGroupAmountChange = (laboratoryId: string, value: number) => {
    if (value === 0) {
      props.onChangeLabGroups(props.labGroups.filter((g) => g.laboratoryId !== laboratoryId));
    } else {
      props.onChangeLabGroups(
        props.labGroups.map((g) => (g.laboratoryId === laboratoryId ? { ...g, amount: value } : g))
      );
    }
  };

  const totalVials = props.labGroups.reduce((acc, g) => acc + g.amount, 0);

  return {
    labGroupsWithNames,
    labIdToAdd,
    setLabIdToAdd,
    availableLaboratories,
    totalVials,
    handleLabGroupAmountChange,
    handleAddLabGroup,
  };
}
