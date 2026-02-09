import {
  Badge,
  Button,
  Card,
  Grid,
  Group,
  RingProgress,
  ScrollArea,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { TableCollumn } from '@/features/data-table/data-table.type';
import { DataTable } from '@/features/data-table/data-table.view';
import {
  getPackageInitialCollumns,
  PackageCollumGetters,
} from '@/features/package/package.constants';
import { Package } from '@/features/package/package.type';
import { Reagent } from '@/features/reagent/reagent.type';
import {
  ConfigReportModal,
  useConfigReportModal,
} from '@/features/report/components/report-options.view';
import { isInsideDateRange } from '@/features/stock-filter/stock-filter.util';
import { Vial } from '@/features/vial/vial.type';
import { useData } from '@/providers/data.provider';
import { firstDayOffsettedMonth } from '@/shared/utils/date';

export function DashboardView() {
  const { onSubmit, openModal, closeModal, modalOpened, reportFilter } = useConfigReportModal();
  const { vials, loadingVials } = useData();

  return (
    <>
      <Grid>
        <Grid.Col span={{ base: 4 }}>
          <InRateDashboardCard vials={vials} loadingVials={loadingVials} />
        </Grid.Col>

        <Grid.Col span={{ base: 4 }}>
          <ExpireSoonDashboardCard />
        </Grid.Col>
        <Grid.Col span={{ base: 4 }}>
          <TopReagentsDashboardCard />
        </Grid.Col>
      </Grid>
      <ConfigReportModal
        onSubmit={onSubmit}
        initialValues={reportFilter}
        onClose={closeModal}
        opened={modalOpened}
      />
      <Button
        variant="outline"
        radius="50px"
        onClick={openModal}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          height: '40px',
        }}
      >
        Editar opções
      </Button>
    </>
  );
}

// =====================
// TOTALS
// =====================

type ReagentsCount = {
  reagent: Reagent;
  count: number;
};

function TopReagentsDashboardCard() {
  const { vials, getPackageById, getReagentById } = useData();

  const reagentsCount = Object.values(
    (vials ?? []).reduce<Record<string, { reagent: Reagent; count: number }>>((acc, vial) => {
      const pkg = getPackageById(vial.packageId);
      const key = String(pkg.reagentId);
      acc[key] ??= { reagent: getReagentById(pkg.reagentId), count: 0 };
      acc[key].count++;
      return acc;
    }, {})
  );

  const collumns: TableCollumn<ReagentsCount>[] = [
    {
      name: 'Reagente',
      accessor: (data) => data.reagent.name,
    },
    {
      name: 'Contagem',
      accessor: (data) => data.count,
      sorter: (a, b) => a.count - b.count,
    },
  ];

  return (
    <Card withBorder radius="md" padding="xl" h="300px">
      <Title order={3} ta="center" fw={700} mb="lg">
        Reagentes em maior quantidade
      </Title>
      <DataTable
        headless
        datas={reagentsCount}
        collumns={collumns}
        sort={{ colunmName: 'Contagem', sortedAscending: true }}
      />
    </Card>
  );
}

// =====================
// EXPIRE SOON
// =====================

function ExpireSoonDashboardCard() {
  const {
    packages,
    loadingPackages,
    getPackageById,
    getReagentById,
    getFundingSourceById,
    getControlAgencyById,
    getLaboratoryById,
    getSupplierById,
  } = useData();

  const soonToBeExpiredPackages = (packages ?? []).filter((pkg) => {
    const now = new Date();
    const oneMonthFromNow = firstDayOffsettedMonth(now, 1);
    return isInsideDateRange(pkg.expireDate, now, oneMonthFromNow);
  });

  const getters: PackageCollumGetters = {
    getPackageById,
    getReagentById,
    getFundingSourceById,
    getControlAgencyById,
    getLaboratoryById,
    getSupplierById,
  };

  const allCollumns: TableCollumn<Package>[] = getPackageInitialCollumns(getters);

  const usedCollumns = allCollumns.filter((col) =>
    ['Vencimento', 'Reagente', 'Tamanho', 'Adquirente'].includes(col.name)
  );

  return (
    <>
      <Card withBorder radius="md" padding="xl" h="300px">
        <Title order={3} ta="center" fw={700} mb="lg">
          Vencimento em breve
        </Title>

        {!loadingPackages && (
          <Grid justify="center" align="center">
            <ScrollArea>
              <DataTable datas={soonToBeExpiredPackages} collumns={usedCollumns} />
            </ScrollArea>
          </Grid>
        )}
      </Card>
    </>
  );
}

// =====================
// IN RATE
// =====================

type InRateDashboardCardProps = {
  vials?: Vial[];
  loadingVials: boolean;
};

function InRateDashboardCard(props: InRateDashboardCardProps) {
  const inCount = (props.vials ?? []).reduce((sum, vial) => sum + (vial.outDate ? 0 : 1), 0);
  const totalCount = (props.vials ?? []).length;
  const inCountPerc = (100 * inCount) / totalCount;

  return (
    <>
      <Card withBorder radius="md" padding="xl" h="300px">
        <Title order={3} ta="center" fw={700}>
          Quantidade por sair
        </Title>

        {!props.loadingVials && (
          <Grid>
            <Grid.Col span={{ base: 6 }}>
              <RingProgress
                size={200}
                thickness={25}
                label={
                  <Text ta="center" size="22px" fw="bold">
                    {inCountPerc.toFixed(0)} %
                  </Text>
                }
                sections={[
                  {
                    value: inCountPerc,
                    color: 'teal',
                  },
                ]}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 6 }}>
              <Stack justify="center" h="100%">
                <Group>
                  <Badge color="teal" />
                  <Text size="16px" fw="bold">
                    Por sair
                  </Text>
                </Group>
                <Group>
                  <Badge color="lightgrey" />
                  <Text size="16px" fw="bold">
                    Saiu
                  </Text>
                </Group>
              </Stack>
            </Grid.Col>
          </Grid>
        )}
      </Card>
    </>
  );
}
