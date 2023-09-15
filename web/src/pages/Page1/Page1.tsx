import { useEffect, useState } from 'react';

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import axios from 'axios';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';

const columns: GridColDef[] = [
  {
    field: 'rankNo',
    headerName: 'Rank',
    type: 'number',
    width: 110,
    align: 'center',
    headerAlign: 'center',
  },
  { field: 'playerName', headerName: 'Player', width: 160 },
  // {
  //   field: 'lastTournamentPoints',
  //   headerName: 'Last DPs',
  //   description: 'Dominican Points obtained in the last tournament',
  //   type: 'number',
  //   width: 230,
  //   align: 'center',
  //   headerAlign: 'center',
  //   valueGetter: (params: GridValueGetterParams) =>
  //     params.row.lastTournamentPoints ? `+${params.row.lastTournamentPoints}` : '',
  // },
  {
    field: 'dominicanPoints',
    headerName: 'DPs',
    description: 'Dominican Points',
    type: 'number',
    width: 120,
    align: 'center',
    headerAlign: 'center',
  },
  // {
  //   field: 'matchPoints',
  //   headerName: 'Match points',
  //   type: 'number',
  //   width: 160,
  //   align: 'center',
  //   headerAlign: 'center',
  // },
  {
    field: 'matchRecords',
    headerName: 'Match records (W-L-D)',
    sortable: false,
    width: 190,
    align: 'center',
    headerAlign: 'center',
  },
  // {
  //   field: 'gamesNumber',
  //   headerName: 'No. games',
  //   type: 'number',
  //   width: 150,
  //   align: 'center',
  //   headerAlign: 'center',
  // },
  // {
  //   field: 'winRate',
  //   headerName: 'Win rate',
  //   width: 130,
  //   align: 'center',
  //   headerAlign: 'center',
  //   valueGetter: (params: GridValueGetterParams) => `${params.row.winRate || 0.0}%`,
  // },
];

interface PlayerRank {
  id: number;
  rankNo: number;
  playerName: string;
  dominicanPoints: number;
  matchRecords: string;
}

async function getTcgRankings() {
  try {
    const response = await axios.get('http://localhost:3000/tcg-rankings');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export default function DataTable() {
  const [rows, setRows] = useState<PlayerRank[]>([]);

  useEffect(() => {
    const fetchData: any = async () => {
      return await getTcgRankings();
    };

    fetchData()
      .then((rankings: any) => {
        const list = [];
        for (const rank of rankings) {
          list.push({
            id: rank.id,
            rankNo: rank.rank_no,
            playerName: rank.player_name,
            dominicanPoints: rank.dominican_points,
            matchRecords: rank.match_records,
          } as PlayerRank);
        }
        setRows(list);
      })
      .catch(console.error);
  }, []);

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
