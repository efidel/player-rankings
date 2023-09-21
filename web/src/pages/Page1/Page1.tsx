import { useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import Box from '@mui/system/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import axios from 'axios';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';

const columns: GridColDef[] = [
  {
    field: 'image',
    headerName: '',
    sortable: false,
    width: 80,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      return <img width="45px" height="45px" src={params.row.image} alt={params.row.id} />;
    },
  },
  {
    field: 'rankNo',
    type: 'number',
    width: 110,
    align: 'center',
    headerAlign: 'center',
    renderHeader: () => (
      <Typography variant="button" gutterBottom>
        Rank
      </Typography>
    ),
    renderCell: (params) => {
      return (
        <Typography variant="button" gutterBottom>
          {params.row.rankNo}
        </Typography>
      );
    },
  },
  {
    field: 'playerName',
    width: 180,
    renderHeader: () => (
      <Typography variant="button" gutterBottom>
        Player
      </Typography>
    ),
    renderCell: (params) => {
      return (
        <Typography variant="button" gutterBottom>
          {params.row.playerName}
        </Typography>
      );
    },
  },
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
    type: 'number',
    width: 210,
    align: 'center',
    headerAlign: 'center',
    renderHeader: () => (
      <Typography variant="button" gutterBottom>
        Dominican points
      </Typography>
    ),
    renderCell: (params) => {
      return (
        <Typography variant="button" gutterBottom>
          {params.row.dominicanPoints}
        </Typography>
      );
    },
  },
  {
    field: 'matchRecords',
    sortable: false,
    width: 220,
    align: 'center',
    headerAlign: 'center',
    renderHeader: () => (
      <Typography variant="button" gutterBottom>
        Match records (W-L-D)
      </Typography>
    ),
    renderCell: (params) => {
      return (
        <Typography variant="button" gutterBottom>
          {params.row.matchRecords}
        </Typography>
      );
    },
  },
  {
    field: 'matchPoints',
    type: 'number',
    width: 180,
    align: 'center',
    headerAlign: 'center',
    renderHeader: () => (
      <Typography variant="button" gutterBottom>
        Match points
      </Typography>
    ),
    renderCell: (params) => {
      return (
        <Typography variant="button" gutterBottom>
          {params.row.matchPoints}
        </Typography>
      );
    },
  },
  {
    field: 'gamesNo',
    type: 'number',
    width: 150,
    align: 'center',
    headerAlign: 'center',
    renderHeader: () => (
      <Typography variant="button" gutterBottom>
        No. games
      </Typography>
    ),
    renderCell: (params) => {
      return (
        <Typography variant="button" gutterBottom>
          {params.row.gamesNo}
        </Typography>
      );
    },
  },
  {
    field: 'winRate',
    width: 140,
    align: 'center',
    headerAlign: 'center',
    renderHeader: () => (
      <Typography variant="button" gutterBottom>
        Win rate
      </Typography>
    ),
    renderCell: (params) => {
      return (
        <Typography variant="button" gutterBottom>
          {`${params.row.winRate || 0.0}%`}
        </Typography>
      );
    },
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

        const newList = list.map((item, index) => ({
          ...item,
          rankNo: index + 1,
          image:
            index == 0
              ? '../../../public/assets/masterball.png'
              : index == 1
              ? '../../../public/assets/ultraball.png'
              : index == 2
              ? '../../../public/assets/greatball.png'
              : index == 3
              ? '../../../public/assets/nestball.png'
              : '../../../public/assets/pokeball.png',
        }));
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
