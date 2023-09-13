import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';

import { rankingData } from './initialData';

const columns: GridColDef[] = [
  {
    field: 'rankNumber',
    headerName: 'Rank',
    type: 'number',
    width: 110,
    align: 'center',
    headerAlign: 'center',
  },
  { field: 'playerName', headerName: 'Player', width: 160 },
  {
    field: 'lastTournamentPoints',
    headerName: 'Last DPs',
    description: 'Dominican Points obtained in the last tournament',
    type: 'number',
    width: 230,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params: GridValueGetterParams) =>
      params.row.lastTournamentPoints ? `+${params.row.lastTournamentPoints}` : '',
  },
  {
    field: 'points',
    headerName: 'DPs',
    description: 'Dominican Points',
    type: 'number',
    width: 120,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'matchPoints',
    headerName: 'Match points',
    type: 'number',
    width: 160,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'matchRecords',
    headerName: 'Match records (W-L-D)',
    sortable: false,
    width: 190,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.matchRecordsWin || 0}-${params.row.matchRecordsLose || 0}-${
        params.row.matchRecordsDraw || 0
      }`,
  },
  {
    field: 'gamesNumber',
    headerName: 'No. games',
    type: 'number',
    width: 150,
    align: 'center',
    headerAlign: 'center',
  },
  {
    field: 'winRate',
    headerName: 'Win rate',
    width: 130,
    align: 'center',
    headerAlign: 'center',
    valueGetter: (params: GridValueGetterParams) => `${params.row.winRate || 0.0}%`,
  },
];

const rows = rankingData;

export default function DataTable() {
  return (
    <>
      <Meta title="page 1" />
      <FullSizeCenteredFlexBox>
        <div style={{ width: '95%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 20]}
          />
        </div>
      </FullSizeCenteredFlexBox>
    </>
  );
}
