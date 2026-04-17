import { Laboratory } from '@/features/named-option/laboratory/laboratory.type';
import { Vial } from '@/features/vial/vial.type';
import { useData } from '@/providers/data.provider';
import { findVialsOfLaboratory } from '@/shared/utils/findEntities';

export function useLaboratoryView() {
  const { laboratories, loadingLaboratories, vials } = useData();

  const generateWarning = (laboratory: Laboratory, relatedVials: Vial[]) => {
    const message = `Excluir o laboratório: ${laboratory.name}
          Causará a exclusão dos seguintes vials:
          ${relatedVials.map((i) => `* ${i.id}`).join('\n')}
          `;

    return message;
  };

  const getWarning = (laboratory: Laboratory) => {
    const relatedVials = findVialsOfLaboratory(laboratory, vials!);
    if (relatedVials.length === 0) return null;
    return generateWarning(laboratory, relatedVials);
  };

  return {
    laboratories,
    loadingLaboratories,
    getWarning,
  };
}
