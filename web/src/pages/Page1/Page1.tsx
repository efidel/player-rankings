import { useEffect, useState } from 'react';

import { Stack } from '@mui/system';
import Box from '@mui/system/Box';
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
    headerName: 'Dominican points',
    description: 'Dominican Points',
    type: 'number',
    width: 190,
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
    field: 'gamesNo',
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

interface PlayerRank {
  id: number;
  rankNo: number;
  playerName: string;
  dominicanPoints: number;
  matchRecords: string;
  matchPoints: number;
  gamesNo: number;
  winRate: string;
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
    const fetchData = async () => {
      return await getTcgRankings();
    };

    fetchData()
      .then((rankings) => {
        const list = [];
        for (const rank of rankings) {
          const matchRecords = rank.match_records;
          const [wins, loses, draws] = matchRecords.split('-').map(Number);

          const matchPoints = 3 * wins + draws;
          const gamesNo = wins + draws + loses;
          const winRate = (matchPoints / (3 * gamesNo)) * 100;

          list.push({
            id: rank.id,
            rankNo: rank.rank_no,
            playerName: rank.player_name,
            dominicanPoints: rank.dominican_points,
            matchRecords: matchRecords,
            matchPoints: matchPoints,
            gamesNo: gamesNo,
            winRate: winRate.toFixed(2),
          } as PlayerRank);

          list.sort((a, b) => {
            if (a.dominicanPoints !== b.dominicanPoints) {
              return b.dominicanPoints - a.dominicanPoints;
            } else {
              return b.matchPoints - a.matchPoints;
            }
          });
        }

        const newList = list.map((item, index) => ({ ...item, rankNo: index + 1 }));
        setRows(newList);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <Meta title="TCG" />
      <FullSizeCenteredFlexBox>
        <Box style={{ width: '95%' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2 }}
            alignItems={'center'}
            marginBottom={'10px'}
          >
            <h1>TCG Player Rankings</h1>
            <h5>(last updated on September 3, 2023)</h5>
          </Stack>
          {/* <Stack direction="row" spacing={1} alignItems={'center'} marginBottom={10}> */}

          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 16 },
              },
            }}
            pageSizeOptions={[16, 32]}
          />
        </Box>
      </FullSizeCenteredFlexBox>
    </>
  );
}
